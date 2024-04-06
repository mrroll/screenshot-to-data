import type * as React from 'react';
import { ThemeProvider } from 'next-themes';

export const AppLayoutClientContextsTheme = (props: {
  children: React.ReactNode;
}) => {
  // https://github.com/pacocoursey/next-themes#with-tailwind
  return (
    <ThemeProvider
      attribute="class"
      // TODO
      // Implement dark mode
      forcedTheme="light"
    >
      {props.children}
    </ThemeProvider>
  );
};
