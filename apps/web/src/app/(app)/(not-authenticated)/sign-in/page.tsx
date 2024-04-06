'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { createBrowserClient } from '@/lib/client/supabase';

import { alertVariants } from '@/components/extended/magic-alert';
import { buttonVariants } from '@/components/extended/magic-button';
import { Card, CardContent } from '@/components/extended/magic-card';
import { inputVariants } from '@/components/extended/magic-input';
import { labelVariants } from '@/components/extended/magic-label';
import { cn } from '@/utilities/client/cn';
import { getHost } from '@/utilities/client/get-host';

const SignInPage = () => {
  const supabase = createBrowserClient();

  return (
    <Card>
      <CardContent
        /**
         * 1.The height accounts for the message element i.e. pt + height +
         * padding We used a fixed outout to minimize CLS
         * 2. Just some good old styling
         * 3. Container. We style it lile this because because for some reason the
         *    container is nested.
         * 4. Form Elements
         */
        className="h-[383px] w-[340px] px-6 pb-0 pt-4
          [&>div>form>div>div:first-child]:flex
          [&>div>form>div>div:first-child]:flex-col
          [&>div>form>div>div:first-child]:gap-y-4 [&>div>form>div]:flex
          [&>div>form>div]:flex-col [&>div>form>div]:gap-y-4"
      >
        <Auth
          supabaseClient={supabase}
          redirectTo={getHost()}
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            extend: false,
            className: {
              button: cn(buttonVariants({ variant: 'default' }), 'w-full'),
              container:
                '[&>div>div]:flex [&>div>div]:flex-col [&>div>div]:gap-y-2',
              anchor: buttonVariants({ variant: 'link' }),
              label: labelVariants(),
              input: inputVariants(),
              message: cn(alertVariants(), 'flex'),
            },
          }}
          providers={[]}
        />
      </CardContent>
    </Card>
  );
};

export default SignInPage;
