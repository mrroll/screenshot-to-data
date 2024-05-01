- bun add ${PACKAGE} from within a package in the monorepo has various issues.

  - tl;dr:
    > Run bun install any-pkg and then manually copy the version specification from the root package.json to the project package.json.
  - It does not work from within ./screenshot-to-data/packages/common
    - [Related issue](https://github.com/oven-sh/bun/issues/7517)
  - It modifies the lockfile in unexpected ways
  - [See this workaround for now](https://github.com/oven-sh/bun/issues/5413#issuecomment-1931422196), specifically:
    > Run bun install any-pkg and then manually copy the version specification from the root package.json to the project package.json.

## Infrastructure for if we do IAC

- [ ] Bucket requires CORS
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html
- [ ] If we want to continue with SNS, we need to set permissions on the topic so that the bucket can trigger it.
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/ways-to-add-notification-config-to-bucket.html#step1-create-sns-topic-for-notification
- [ ] Supabase requires Redirect URLs to be set
- [ ] Supabase probably needs SES instead of the built in one.
- [ ] We are borrowing Magic LLM's Redis instance. We really want of our own here.
- [ ] Vercel, Supabase, and S3 regions should all be the same.
