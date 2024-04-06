import type * as React from 'react';

const AppNotAuthenticatedErrorLayout = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;

  return (
    <div
      className="min-w-screen flex min-h-screen flex-col items-center
        justify-center"
    >
      <h1>Error</h1>
      {children}
    </div>
  );
};

export default AppNotAuthenticatedErrorLayout;
