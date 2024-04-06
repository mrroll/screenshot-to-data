'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';

import { createBrowserClient } from '@/lib/client/supabase';

import { buttonVariants } from '@/components/extended/magic-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AUTH_STATUSES, useUser } from '@/hooks/use-user';
import { LogoIcon } from '@/icons/logo';
import { TVIcon } from '@/icons/tv-icon';

export const AppAuthenticatedLayoutClient = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;

  const { query, status } = useUser();

  const router = useRouter();

  // Warning: Cannot update a component (`Router`) while rendering a different component
  React.useEffect(() => {
    if (status === AUTH_STATUSES.LOADING) {
      return;
    }

    if (status === AUTH_STATUSES.AUTHORIZED) {
      return;
    }

    if (status === AUTH_STATUSES.UNAUTHORIZED) {
      router.replace('/not-authorized');
    }

    if (status === AUTH_STATUSES.SIGNED_OUT) {
      router.replace('/sign-in');
    }
  }, [status, router]);

  if (status !== AUTH_STATUSES.AUTHORIZED) {
    return null;
  }

  const email = query.data?.CurrentUser?.email;

  if (typeof email !== 'string') {
    return null;
  }

  const userName = email.split('@')[0];

  if (typeof userName !== 'string') {
    throw new Error('userName is not defined.');
  }

  const [firstName, lastName] = userName.split('.');

  if (typeof firstName !== 'string') {
    throw new Error('firstName is not defined.');
  }

  const firstLetterOfFirstName = firstName[0];
  const firstLetterOfLastName = lastName?.[0];

  const avatarLetter = `${firstLetterOfFirstName}${typeof firstLetterOfLastName === 'string' ? firstLetterOfLastName : ''}`;

  if (typeof avatarLetter !== 'string') {
    return null;
  }

  const supabase = createBrowserClient();

  const handleSignOut: React.ComponentProps<
    typeof DropdownMenuItem
  >['onClick'] = () => void supabase.auth.signOut();

  return (
    <div>
      <aside
        className="inset-y fixed left-0 z-20 flex h-full min-w-[72px] flex-col
          bg-card pt-[72px] text-card-foreground"
      >
        <Link href="/" aria-label="Screenshots" className="fixed left-4 top-4">
          <LogoIcon className="w-10" />
        </Link>
        <nav
          className="mx-auto grid gap-1 p-2 [&_svg]:w-[22px]
            [&_svg]:text-muted-foreground"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                aria-label="Screenshots"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                  className: 'rounded-lg hover:bg-transparent',
                })}
              >
                <TVIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Screenshots
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <nav
        className="inset-x fixed top-0 z-10 flex w-full bg-card p-4 pl-[72px]
          shadow"
      >
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="shadow">
                <AvatarFallback>{avatarLetter.toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="flex items-center">
                <UserIcon className="mr-2" />
                <p className="pt-1">{email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/preferences">
                  <SettingsIcon className="mr-2" />
                  <p className="pt-1">Preferences</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon className="mr-2" />
                <p className="pt-1">Sign Out</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      {children}
    </div>
  );
};
