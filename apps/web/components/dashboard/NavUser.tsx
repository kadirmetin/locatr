'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { ChevronsUpDown, LogOut, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from '@/components/ui/image';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { logoutMutationFunction } from '@/lib/api/auth.api';
import { UserType } from '@/lib/types/user.type';

import { useToast } from '@/hooks/use-toast';

import { useAuthContext } from '@/context/auth-provider';
import { useDialog } from '@/context/dialog-provider';

interface NavUserProps {
  user: UserType;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { openDialog } = useDialog();
  const { toast } = useToast();
  const router = useRouter();
  const { setIsLoggingOut } = useAuthContext();

  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutMutationFunction,
  });

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      toast({
        title: 'Logging out...',
        description: 'Please wait while we log you out.',
      });

      await logout();
      router.replace('/auth/login');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred during logout';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsLoggingOut(false);
    }
  }, [logout, router, setIsLoggingOut, toast]);

  const handleThemeChange = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const handleLogoutConfirmation = useCallback(() => {
    openDialog('confirmation', {
      onConfirmAction: handleLogout,
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      isDestructive: false,
    });
  }, [openDialog, handleLogout]);

  const userFullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userEmail = user?.email || 'User Email';
  const userInitials = user ? user.firstName.charAt(0).toUpperCase() : 'L';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user?.avatar ? (
                  <Image
                    alt={`${userFullName}'s profile picture`}
                    src={user.avatar}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-lg border object-cover shadow-md"
                  />
                ) : (
                  <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userFullName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleThemeChange} className="cursor-pointer">
                <SunMoon />
                Theme
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutConfirmation}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
