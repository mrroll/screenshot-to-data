import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'remeda';
import { toast } from 'sonner';
import { z } from 'zod';

import { CurrentUserQuery } from '@/app/(app)/(authenticated)/preferences/_page-current-user-query';
import { Button } from '@/components/extended/magic-button';
import { Label } from '@/components/extended/magic-label';
import { Textarea } from '@/components/extended/magic-textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { graphql, type ResultOf } from '@/graphql/graphql';
import { useGraphQLMutation } from '@/hooks/use-graphql-mutation';

const formSchema = z.object({
  Prompt: z.string(),
});

const CurrentUserMutation = graphql(`
  mutation CurrentUserMutation($user_preference: UserPreferenceInput!) {
    CurrentUser(user_preference: $user_preference) {
      user_preference {
        Prompt
      }
    }
  }
`);

export const PreferencesPageForm = (props: {
  CurrentUser: ResultOf<typeof CurrentUserQuery>['CurrentUser'];
}) => {
  const { CurrentUser } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Prompt: CurrentUser.user_preference?.Prompt ?? '',
    },
  });

  const mutation = useGraphQLMutation({
    document: CurrentUserMutation,
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const touched = form.formState.touchedFields;

    if (isEmpty(touched)) {
      return toast.error(
        'No changes have been made. Please make some changes before saving',
      );
    }

    const updated = Object.fromEntries(
      Object.entries(values).filter(([key]) => {
        return touched[key as keyof typeof touched];
      }),
    ) as typeof values;

    const promise = mutation.mutateAsync({
      user_preference: updated,
    });

    toast.promise(promise, {
      loading: 'Saving User Preferences',
      success: 'User Preferences Saved',
    });

    await promise;

    const queryKey = [CurrentUserQuery];

    queryClient.setQueryData<ResultOf<typeof CurrentUserQuery>>(
      queryKey,
      (data) => {
        return {
          CurrentUser: {
            email: data?.CurrentUser.email ?? '',
            user_preference: updated,
          },
        };
      },
    );

    return queryClient.invalidateQueries({ queryKey });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Prompt"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <React.Fragment>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="What is in this picture?"
                      {...field}
                    />
                  </React.Fragment>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" disabled={mutation.isPending}>
          Save Preferences
        </Button>
      </form>
    </Form>
  );
};
