import { type Metadata } from 'next';
import { Hind } from 'next/font/google';
import type * as React from 'react';

export const metadata: Metadata = {
  title: 'Magic 2 Screenshot to Data',
};

const hind = Hind({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
});

const RootLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <html
      lang="en"
      // https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      className={hind.variable}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
};

export default RootLayout;
