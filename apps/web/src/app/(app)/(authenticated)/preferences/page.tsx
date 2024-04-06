'use client';

import { CurrentUserQuery } from '@/app/(app)/(authenticated)/preferences/_page-current-user-query';
import { PreferencesPageForm as Form } from '@/app/(app)/(authenticated)/preferences/_page-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/extended/magic-card';
import { useGraphQLQuery } from '@/hooks/use-graphql-query';

const PreferencesPage = () => {
  const { data } = useGraphQLQuery({
    queryKey: [CurrentUserQuery],
  });

  if (typeof data === 'undefined') {
    return null;
  }

  const { CurrentUser } = data;

  return (
    <div className=" mx-auto flex w-[680px] flex-col gap-y-16 py-[10%]">
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-8">
          <Form CurrentUser={CurrentUser} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesPage;
