import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// https://codesandbox.io/p/devbox/tanstack-query-example-react-nextjs-14udt5
export const AppLayoutClientContextsQueryClient = (props: {
  children: React.ReactNode;
}) => {
  const [client] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
};
