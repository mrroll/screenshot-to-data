import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TContextType } from '@/graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
  JSON: { input: any; output: any; }
  SafeInt: { input: number; output: number; }
  Void: { input: null; output: null; }
};

export type CurrentUserMutationInput = {
  user_preference?: InputMaybe<UserPreferenceInput>;
};

export type CurrentUserMutationOutput = {
  __typename?: 'CurrentUserMutationOutput';
  user_preference?: Maybe<UserPreference>;
};

export type GenerateS3SignedUrlMutationInput = {
  name: Scalars['String']['input'];
};

export type GenerateS3SignedUrlMutationOutput = {
  __typename?: 'GenerateS3SignedURLMutationOutput';
  URL: Scalars['String']['output'];
  exists: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type Health = {
  __typename?: 'Health';
  Ollama: Scalars['String']['output'];
};

export type HealthMutationInput = {
  Ollama?: InputMaybe<Scalars['String']['input']>;
};

export type Lock = {
  __typename?: 'Lock';
  expirationTime?: Maybe<Scalars['SafeInt']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  ttl?: Maybe<Scalars['SafeInt']['output']>;
};

export type LockMutationInput = {
  expirationTime?: InputMaybe<Scalars['SafeInt']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  ttl?: InputMaybe<Scalars['SafeInt']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  CurrentUser: CurrentUserMutationOutput;
  DeleteLock?: Maybe<Scalars['Void']['output']>;
  GenerateS3SignedURLs: Array<GenerateS3SignedUrlMutationOutput>;
  Health: Health;
  Lock: Lock;
};


export type MutationCurrentUserArgs = {
  options: CurrentUserMutationInput;
};


export type MutationDeleteLockArgs = {
  options?: InputMaybe<LockMutationInput>;
};


export type MutationGenerateS3SignedUrLsArgs = {
  options: Array<GenerateS3SignedUrlMutationInput>;
};


export type MutationHealthArgs = {
  options?: InputMaybe<HealthMutationInput>;
};


export type MutationLockArgs = {
  options?: InputMaybe<LockMutationInput>;
};

export type Query = {
  __typename?: 'Query';
  CurrentUser: User;
  Health: Health;
  Screenshot: Screenshot;
  Screenshots: Array<Screenshot>;
};


export type QueryScreenshotArgs = {
  CUID2: Scalars['String']['input'];
};


export type QueryScreenshotsArgs = {
  options?: InputMaybe<ScreenshotsQueryInput>;
};

export type Screenshot = {
  __typename?: 'Screenshot';
  CUID2: Scalars['String']['output'];
  CreatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  Height?: Maybe<Scalars['Int']['output']>;
  OriginalFilename?: Maybe<Scalars['String']['output']>;
  S3Filename?: Maybe<Scalars['String']['output']>;
  S3URL?: Maybe<Scalars['String']['output']>;
  UpdatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  Width?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
};

export type ScreenshotsQueryInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderByDirection?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  aud?: Maybe<Scalars['String']['output']>;
  banned_until?: Maybe<Scalars['DateTimeISO']['output']>;
  confirmation_sent_at?: Maybe<Scalars['DateTimeISO']['output']>;
  confirmation_token?: Maybe<Scalars['String']['output']>;
  confirmed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  created_at?: Maybe<Scalars['DateTimeISO']['output']>;
  deleted_at?: Maybe<Scalars['DateTimeISO']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_change?: Maybe<Scalars['String']['output']>;
  email_change_confirm_status?: Maybe<Scalars['Int']['output']>;
  email_change_sent_at?: Maybe<Scalars['DateTimeISO']['output']>;
  email_change_token_current?: Maybe<Scalars['String']['output']>;
  email_change_token_new?: Maybe<Scalars['String']['output']>;
  email_confirmed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  encrypted_password?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  instance_id?: Maybe<Scalars['String']['output']>;
  invited_at?: Maybe<Scalars['DateTimeISO']['output']>;
  is_anonymous?: Maybe<Scalars['Boolean']['output']>;
  is_sso_user?: Maybe<Scalars['Boolean']['output']>;
  is_super_admin?: Maybe<Scalars['Boolean']['output']>;
  last_sign_in_at?: Maybe<Scalars['DateTimeISO']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phone_change?: Maybe<Scalars['String']['output']>;
  phone_change_sent_at?: Maybe<Scalars['DateTimeISO']['output']>;
  phone_change_token?: Maybe<Scalars['String']['output']>;
  phone_confirmed_at?: Maybe<Scalars['DateTimeISO']['output']>;
  raw_app_meta_data?: Maybe<Scalars['JSON']['output']>;
  raw_user_meta_data?: Maybe<Scalars['JSON']['output']>;
  reauthentication_sent_at?: Maybe<Scalars['DateTimeISO']['output']>;
  reauthentication_token?: Maybe<Scalars['String']['output']>;
  recovery_sent_at?: Maybe<Scalars['DateTimeISO']['output']>;
  recovery_token?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  screenshot?: Maybe<Array<Maybe<Screenshot>>>;
  updated_at?: Maybe<Scalars['DateTimeISO']['output']>;
  user_preference?: Maybe<UserPreference>;
};

export type UserPreference = {
  __typename?: 'UserPreference';
  CUID2: Scalars['String']['output'];
  Prompt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type UserPreferenceInput = {
  Prompt?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CurrentUserMutationInput: CurrentUserMutationInput;
  CurrentUserMutationOutput: ResolverTypeWrapper<CurrentUserMutationOutput>;
  DateTimeISO: ResolverTypeWrapper<Scalars['DateTimeISO']['output']>;
  GenerateS3SignedURLMutationInput: GenerateS3SignedUrlMutationInput;
  GenerateS3SignedURLMutationOutput: ResolverTypeWrapper<GenerateS3SignedUrlMutationOutput>;
  Health: ResolverTypeWrapper<Health>;
  HealthMutationInput: HealthMutationInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Lock: ResolverTypeWrapper<Lock>;
  LockMutationInput: LockMutationInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SafeInt: ResolverTypeWrapper<Scalars['SafeInt']['output']>;
  Screenshot: ResolverTypeWrapper<Screenshot>;
  ScreenshotsQueryInput: ScreenshotsQueryInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  UserPreference: ResolverTypeWrapper<UserPreference>;
  UserPreferenceInput: UserPreferenceInput;
  Void: ResolverTypeWrapper<Scalars['Void']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CurrentUserMutationInput: CurrentUserMutationInput;
  CurrentUserMutationOutput: CurrentUserMutationOutput;
  DateTimeISO: Scalars['DateTimeISO']['output'];
  GenerateS3SignedURLMutationInput: GenerateS3SignedUrlMutationInput;
  GenerateS3SignedURLMutationOutput: GenerateS3SignedUrlMutationOutput;
  Health: Health;
  HealthMutationInput: HealthMutationInput;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Lock: Lock;
  LockMutationInput: LockMutationInput;
  Mutation: {};
  Query: {};
  SafeInt: Scalars['SafeInt']['output'];
  Screenshot: Screenshot;
  ScreenshotsQueryInput: ScreenshotsQueryInput;
  String: Scalars['String']['output'];
  User: User;
  UserPreference: UserPreference;
  UserPreferenceInput: UserPreferenceInput;
  Void: Scalars['Void']['output'];
}>;

export type CurrentUserMutationOutputResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['CurrentUserMutationOutput'] = ResolversParentTypes['CurrentUserMutationOutput']> = ResolversObject<{
  user_preference?: Resolver<Maybe<ResolversTypes['UserPreference']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeIsoScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTimeISO'], any> {
  name: 'DateTimeISO';
}

export type GenerateS3SignedUrlMutationOutputResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['GenerateS3SignedURLMutationOutput'] = ResolversParentTypes['GenerateS3SignedURLMutationOutput']> = ResolversObject<{
  URL?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HealthResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['Health'] = ResolversParentTypes['Health']> = ResolversObject<{
  Ollama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LockResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['Lock'] = ResolversParentTypes['Lock']> = ResolversObject<{
  expirationTime?: Resolver<Maybe<ResolversTypes['SafeInt']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ttl?: Resolver<Maybe<ResolversTypes['SafeInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  CurrentUser?: Resolver<ResolversTypes['CurrentUserMutationOutput'], ParentType, ContextType, RequireFields<MutationCurrentUserArgs, 'options'>>;
  DeleteLock?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, Partial<MutationDeleteLockArgs>>;
  GenerateS3SignedURLs?: Resolver<Array<ResolversTypes['GenerateS3SignedURLMutationOutput']>, ParentType, ContextType, RequireFields<MutationGenerateS3SignedUrLsArgs, 'options'>>;
  Health?: Resolver<ResolversTypes['Health'], ParentType, ContextType, Partial<MutationHealthArgs>>;
  Lock?: Resolver<ResolversTypes['Lock'], ParentType, ContextType, Partial<MutationLockArgs>>;
}>;

export type QueryResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  CurrentUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  Health?: Resolver<ResolversTypes['Health'], ParentType, ContextType>;
  Screenshot?: Resolver<ResolversTypes['Screenshot'], ParentType, ContextType, RequireFields<QueryScreenshotArgs, 'CUID2'>>;
  Screenshots?: Resolver<Array<ResolversTypes['Screenshot']>, ParentType, ContextType, Partial<QueryScreenshotsArgs>>;
}>;

export interface SafeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SafeInt'], any> {
  name: 'SafeInt';
}

export type ScreenshotResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['Screenshot'] = ResolversParentTypes['Screenshot']> = ResolversObject<{
  CUID2?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  CreatedAt?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  Description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  OriginalFilename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  S3Filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  S3URL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  UpdatedAt?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  Width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  aud?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  banned_until?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  confirmation_sent_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  confirmation_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  confirmed_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_change?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_change_confirm_status?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  email_change_sent_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  email_change_token_current?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_change_token_new?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_confirmed_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  encrypted_password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instance_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invited_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  is_anonymous?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_sso_user?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_super_admin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  last_sign_in_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_change?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_change_sent_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  phone_change_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_confirmed_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  raw_app_meta_data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  raw_user_meta_data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  reauthentication_sent_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  reauthentication_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recovery_sent_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  recovery_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  screenshot?: Resolver<Maybe<Array<Maybe<ResolversTypes['Screenshot']>>>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTimeISO']>, ParentType, ContextType>;
  user_preference?: Resolver<Maybe<ResolversTypes['UserPreference']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserPreferenceResolvers<ContextType = TContextType, ParentType extends ResolversParentTypes['UserPreference'] = ResolversParentTypes['UserPreference']> = ResolversObject<{
  CUID2?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Prompt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = TContextType> = ResolversObject<{
  CurrentUserMutationOutput?: CurrentUserMutationOutputResolvers<ContextType>;
  DateTimeISO?: GraphQLScalarType;
  GenerateS3SignedURLMutationOutput?: GenerateS3SignedUrlMutationOutputResolvers<ContextType>;
  Health?: HealthResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Lock?: LockResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SafeInt?: GraphQLScalarType;
  Screenshot?: ScreenshotResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPreference?: UserPreferenceResolvers<ContextType>;
  Void?: GraphQLScalarType;
}>;

