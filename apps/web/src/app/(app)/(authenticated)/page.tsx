'use client';

import * as React from 'react';
import { Sha256 } from '@aws-crypto/sha256-browser';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQueryClient,
  type DefaultError,
} from '@tanstack/react-query';
import { useChat } from 'ai/react';
import Bluebird from 'bluebird';
import { LoaderCircleIcon } from 'lucide-react';
import { Duration } from 'luxon';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { getKey } from '@/lib/redis';

import { AppPageScreenshot as Screenshot } from '@/app/(app)/(authenticated)/_page-screenshot';
import { AppPageScreenshotScreenshotsQuery as ScreenshotsQuery } from '@/app/(app)/(authenticated)/_page-screenshot/screenshots-query';
import { Button } from '@/components/extended/magic-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/extended/magic-card';
import { Input } from '@/components/extended/magic-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { config } from '@/config/client';
import { graphql, type ResultOf } from '@/graphql/graphql';
import { useGraphQLMutation } from '@/hooks/use-graphql-mutation';
import { useGraphQLQuery } from '@/hooks/use-graphql-query';
import { useInfiniteGraphQLQuery } from '@/hooks/use-infinite-graphql-query';
import { cn } from '@/utilities/client/cn';
import { PromiseWithResolvers } from '@/utilities/promise-with-resolvers';

const Loader = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;

  return (
    <div className="flex w-full flex-col gap-y-2">
      <p>
        {current !== total ? (
          <React.Fragment>
            Currently processing file{' '}
            <span className="font-mono">
              {current + 1}/{total}
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>Processing Files Complete</React.Fragment>
        )}
      </p>

      <div className="flex w-full gap-x-1">
        <Progress
          className={cn(current !== total && 'animate-pulse')}
          value={progress}
        />
        <p className="font-mono">{progress.toFixed(2)}%</p>
      </div>
    </div>
  );
};

const BUSY_MESSAGE =
  '🔴 All our servers are busy at the moment. Please try again later.';

const HealthQuery = graphql(`
  query HealthQuery {
    Health {
      Ollama
    }
  }
`);

const HealthMutation = graphql(`
  mutation HealthMutation($Ollama: Boolean) {
    Health(Ollama: $Ollama) {
      Ollama
    }
  }
`);

const S3SignedURLsMutation = graphql(`
  mutation S3SignedURLsMutation($S3SignedURLs: [S3SignedURLsInput!]!) {
    S3SignedURLs(S3SignedURLs: $S3SignedURLs) {
      URL
      name
      exists
    }
  }
`);

const LockMutation = graphql(`
  mutation LockMutation($key: String, $ttl: SafeInt) {
    Lock(key: $key, ttl: $ttl) {
      key
      owner
      ttl
      expirationTime
    }
  }
`);

const LockRemoveMutation = graphql(`
  mutation LockRemoveMutation(
    $key: String
    $owner: String
    $ttl: SafeInt
    $expirationTime: SafeInt
  ) {
    LockRemove(
      key: $key
      owner: $owner
      ttl: $ttl
      expirationTime: $expirationTime
    )
  }
`);

const formSchema = z.object({
  files: z.array(
    z.object({
      fileReference:
        typeof window !== 'undefined' ? z.instanceof(File) : z.never(),
      sha256: z.string().optional(),
      fileName: z.string().optional(),
      dataURL: z.union([z.instanceof(ArrayBuffer), z.string()]).optional(),
    }),
  ),
});

const AppPage = () => {
  const { data, fetchNextPage, isFetching } = useInfiniteGraphQLQuery({
    queryKey: [ScreenshotsQuery, { limit: 10 }],
    initialPageParam: undefined,
    getNextPageParam: (data) => {
      return {
        first: 10,
        after: data.Screenshots[data.Screenshots.length - 1]?.CUID2,
      };
    },
  });

  const healthQuery = useGraphQLQuery({
    queryKey: [HealthQuery],
  });

  const healthMutation = useGraphQLMutation({
    document: HealthMutation,
  });

  const s3SignedURLsMutation = useGraphQLMutation({
    document: S3SignedURLsMutation,
  });

  const lockMutation = useGraphQLMutation({
    document: LockMutation,
  });

  const lockRemoveMutation = useGraphQLMutation({
    document: LockRemoveMutation,
  });

  const uploadImageToS3Mutation = useMutation<
    void,
    DefaultError,
    { URL: string; body: File }
  >({
    mutationFn: async ({ URL, body }) => {
      const request = await fetch(URL, {
        method: 'PUT',
        body,
      });

      if (request.status !== 200) {
        throw new Error('request.status is not 200');
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const [filesInputDisplayValue, setFilesInputDisplayValue] =
    React.useState('');

  const [isRunning, setIsRunning] = React.useState(false);

  const [currentlyUploadingFileName, setCurrentlyUploadingFileName] =
    React.useState<string | null>(null);

  const chat = useChat({
    sendExtraMessageFields: true,
    // This is neccessary, otherwise chat.reload() errors will be swallowed.
    onError: (error) => {
      throw error;
    },
  });

  const transcript = chat.messages;

  const message = transcript[transcript.length - 1];

  const filesInputValue = form.watch('files');

  const currentlyUploadingFile = filesInputValue.find(
    (item) => item.fileName === currentlyUploadingFileName,
  );

  const queryClient = useQueryClient();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsRunning(true);

    const lastLock: {
      key: string | null;
      owner: string | null;
      ttl: number | null;
      expirationTime: number | null;
    } = {
      key: null,
      owner: null,
      ttl: null,
      expirationTime: null,
    };

    try {
      let statusToastID = null as string | number | null;

      const s3SignedURLsMutationPromise = s3SignedURLsMutation.mutateAsync({
        S3SignedURLs: values.files.map(({ fileName }) => {
          if (typeof fileName !== 'string') {
            throw new Error('fileName is not a string');
          }

          return {
            name: fileName,
          };
        }),
      });

      statusToastID = toast.promise(s3SignedURLsMutationPromise, {
        loading: 'Creating Upload URLs for Images',
        success: 'Successfully created Upload URLs for Images',
      });

      const { S3SignedURLs } = await s3SignedURLsMutationPromise;

      const uploadFilesToS3Promise = Promise.allSettled(
        S3SignedURLs.map(async ({ name, URL, exists }) => {
          const file = values.files.find((file) => file.fileName === name);

          if (typeof file === 'undefined') {
            throw new Error('file is not defined.');
          }

          // Since we're hashing the file, there's no reason to reupload it if it already exists.
          if (exists !== true) {
            await uploadImageToS3Mutation.mutateAsync({
              URL,
              body: file.fileReference,
            });
          }

          if (typeof file.fileName !== 'string') {
            throw new Error('file.fileName is not a string');
          }

          return { fileName: file.fileName, file: file.fileReference };
        }),
      );

      toast.promise(uploadFilesToS3Promise, {
        loading: 'Uploading Images',
        success: 'Successfully uploaded Images',
        id: statusToastID,
      });

      const uploadedFilesToS3 = await uploadFilesToS3Promise;

      const progress = { current: 0, total: uploadedFilesToS3.length };

      toast(<Loader current={progress.current} total={progress.total} />, {
        id: statusToastID,
        duration: Duration.fromObject({ minutes: 2.5 }).as('milliseconds'),
      });

      const processAllImagesPromise = Bluebird.map(
        uploadedFilesToS3,
        async (uploadedFileToS3, index) => {
          if (uploadedFileToS3.status !== 'fulfilled') {
            throw new Error('promise.status is not fulfilled');
          }

          const { Lock } = await lockMutation.mutateAsync({
            key: getKey('verrou:/api/chat/route'),
            // 2 and a half minutes is plenty of time for our model to load in case
            // it hasn't already and for it to actually respond, too.
            ttl: Duration.fromObject({ minutes: 2.5 }).as('milliseconds'),
          });

          if (Lock.key === null) {
            throw new Error(BUSY_MESSAGE);
          }

          lastLock.key = Lock.key;
          lastLock.owner = Lock.owner;
          lastLock.ttl = Lock.ttl;
          lastLock.expirationTime = Lock.expirationTime;

          setCurrentlyUploadingFileName(uploadedFileToS3.value.fileName);

          // Let's use the id field to tell the backend what each item.content
          // contains. If you update this, ensure that you update the length
          // checker (CMD + F "> 3") which checks the length of the messages
          // to determine whether or not the AI has started to respondeyet.
          chat.setMessages([
            {
              id: 'uploadedFileName',
              role: 'system',
              content: uploadedFileToS3.value.fileName,
            },
            {
              id: 'originalFilename',
              role: 'system',
              content: uploadedFileToS3.value.file.name,
            },
            { id: 'lock', role: 'system', content: JSON.stringify(Lock) },
          ]);

          await chat.reload();

          progress.current = index + 1;

          toast(<Loader current={progress.current} total={progress.total} />, {
            id: statusToastID,
            duration: Duration.fromObject({ minutes: 2.5 }).as('milliseconds'),
          });

          // TODO
          // Add optimistic UI
          // This will fetch all the pages in the infinite query. What we want here is to revert back to just the first page.
          return queryClient.invalidateQueries({
            queryKey: [ScreenshotsQuery],
          });
        },
        {
          concurrency: 1,
        },
      ).catch(async (error) => {
        if (error instanceof Error) {
          if (
            // This is a known error that is returned by our app route
            error.message === 'Service Unavailable' ||
            // https://github.com/vercel/ai/blob/9885b81443a4b1236a046dc0ac83128c3863e255/packages/core/shared/call-completion-api.ts#L70
            error.message === 'Failed to fetch the chat response.'
          ) {
            const resetPromise = healthMutation.mutateAsync({ Ollama: true });

            toast.promise(resetPromise, {
              loading:
                'A response was not received in a timely manner from the AI assistant. An attempt will be made to restart the server. Please do not leave this page.',
              success:
                'Successfully restarted the AI assistant. You may try to process your images again.',
              id: statusToastID,
              // https://sonner.emilkowal.ski/toast#api-reference
              duration: 4000,
            });

            await resetPromise;
          } else {
            toast.error(error.message, {
              id: statusToastID,
              // https://sonner.emilkowal.ski/toast#api-reference
              duration: 4000,
            });
          }
        }

        throw error;
      });

      await processAllImagesPromise;

      toast.success('Successfully processed all images', {
        id: statusToastID,
        // https://sonner.emilkowal.ski/toast#api-reference
        duration: 4000,
      });

      form.reset();

      setFilesInputDisplayValue('');
    } catch (error) {
      chat.setMessages([]);

      await lockRemoveMutation.mutateAsync(lastLock);

      throw error;
    } finally {
      setCurrentlyUploadingFileName(null);

      queryClient.setQueryData<ResultOf<typeof HealthQuery>>([HealthQuery], {
        Health: { Ollama: 'OK' },
      });

      await healthQuery.refetch();

      setIsRunning(false);
    }
  };

  if (typeof data === 'undefined') {
    return null;
  }

  const Screenshots = data.pages.flatMap(({ Screenshots }) => Screenshots);

  return (
    <div className=" mx-auto flex w-[680px] flex-col gap-y-16 py-[10%]">
      <Card>
        <CardHeader>
          <CardTitle>Process Images</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          multiple
                          accept="image/*"
                          value={filesInputDisplayValue}
                          onChange={async (event) => {
                            const files = event.target.files;

                            if (files === null) {
                              throw new Error('files is null');
                            }

                            setFilesInputDisplayValue(event.target.value);

                            // Implementation derived from https://blog.logrocket.com/using-filereader-api-preview-images-react/
                            const fileReaders: Array<FileReader> = [];

                            if (files.length < 1) {
                              return;
                            }

                            const promises = Array.from(files).map((file) => {
                              const { promise, resolve, reject } =
                                PromiseWithResolvers.withResolvers<
                                  z.infer<typeof formSchema>['files'][number]
                                >();

                              const fileReader = new FileReader();

                              fileReaders.push(fileReader);

                              fileReader.onload = async (event) => {
                                if (event.target === null) {
                                  return reject(
                                    new Error('event.target is null'),
                                  );
                                }

                                const { result: dataURL } = event.target;

                                if (dataURL === null) {
                                  return reject(new Error('dataURL is null'));
                                }

                                const hash = new Sha256();

                                const nameArray = file.name.split('.');

                                const ext = nameArray[nameArray.length - 1];

                                const fileArrayBuffer =
                                  await file.arrayBuffer();

                                hash.update(fileArrayBuffer);

                                const hashDigest = await hash.digest();

                                const sha256 =
                                  Buffer.from(hashDigest).toString('hex');

                                resolve({
                                  fileReference: file,
                                  sha256,
                                  dataURL,
                                  fileName: `${config.NEXT_PUBLIC_S3_BUCKET_PREFIX}raw/${sha256}.${ext}`,
                                });
                              };

                              fileReader.onabort = () => {
                                reject(new Error('File reading aborted'));
                              };

                              fileReader.onerror = () => {
                                reject(new Error('Failed to read file'));
                              };

                              fileReader.readAsDataURL(file);

                              return promise;
                            });

                            const items = await Promise.all(promises);

                            const data: z.infer<typeof formSchema>['files'] =
                              items;

                            field.onChange(data);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button
                type="submit"
                disabled={isRunning || healthQuery.data?.Health.Ollama !== 'OK'}
              >
                Process
              </Button>
              {isRunning !== true &&
              typeof healthQuery.data !== 'undefined' &&
              healthQuery.data.Health.Ollama !== 'OK' ? (
                // TODO
                // Make this look nicer
                <p>{BUSY_MESSAGE}</p>
              ) : null}
            </form>
          </Form>
        </CardContent>
      </Card>

      {typeof currentlyUploadingFile !== 'undefined' &&
        typeof currentlyUploadingFile.dataURL === 'string' &&
        typeof message !== 'undefined' && (
          <Card className="space-y-8">
            <CardHeader>
              <CardTitle>
                <div className="flex gap-x-2">
                  <LoaderCircleIcon className="mt-2 animate-spin" />
                  <span>{currentlyUploadingFile.fileReference.name}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-12">
              {/* eslint-disable-next-line @next/next/no-img-element -- This is a generated image */}
              <img src={currentlyUploadingFile.dataURL} alt={message.content} />
              {/**
               * We're checking to see if the AI has responded. We send the
               * filename and original filename to the AI which makes up the
               * first two messages.
               */}
              {transcript.length > 3 && (
                <div className="font-normal">
                  {message.content.split('\n').map((line, index) => (
                    // eslint-disable-next-line react/no-array-index-key -- There's no way to ensure uniqueness
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {Screenshots.map((screenshot, index) => {
        return (
          <Screenshot
            key={screenshot.CUID2}
            screenshot={screenshot}
            priority={index === 0}
          />
        );
      })}

      <Button
        onClick={() => {
          if (isFetching) {
            return;
          }

          return fetchNextPage();
        }}
        disabled={isFetching || healthQuery.data?.Health.Ollama !== 'OK'}
      >
        Load More Screenshots
      </Button>
    </div>
  );
};

export default AppPage;
