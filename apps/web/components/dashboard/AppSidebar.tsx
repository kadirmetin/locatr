'use client';

import Image from 'next/image';

import { IconCup } from '@tabler/icons-react';
import { Github, LayoutDashboard, Map, Send, Settings2, Smartphone } from 'lucide-react';
import { useTheme } from 'next-themes';

import { NavMain } from '@/components/dashboard/NavMain';
import { NavSecondary } from '@/components/dashboard/NavSecondary';
import { NavUser } from '@/components/dashboard/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuthContext } from '@/context/auth-provider';
import { useDialog } from '@/context/dialog-provider';
import LogoBlack from '@/public/logo-black.svg';
import Logo from '@/public/logo.svg';

export function AppSidebar() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuthContext();
  const { openDialog } = useDialog();

  const logoSrc = resolvedTheme === 'dark' ? Logo : LogoBlack;

  const navMain = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Map',
      url: '/dashboard/map',
      icon: Map,
    },
    {
      title: 'Devices',
      url: '/dashboard/devices',
      icon: Smartphone,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings2,
      items: [
        {
          title: 'Profile',
          url: '/dashboard/settings?tab=profile',
        },
        {
          title: 'Account',
          url: '/dashboard/settings?tab=account',
        },
        {
          title: 'Notifications',
          url: '/dashboard/settings?tab=notifications',
        },
        {
          title: 'Security',
          url: '/dashboard/settings?tab=security',
        },
      ],
    },
  ] as const;

  const navSecondary = [
    {
      title: 'Feedback',
      onClick: () => {
        openDialog('feedback', {});
      },
      icon: Send,
    },
    {
      title: 'GitHub',
      url: 'https://github.com/kadirmetin/locatr',
      icon: Github,
    },
    {
      title: 'Buy Me a Coffee',
      url: 'https://coff.ee/kadirmetin',
      icon: IconCup,
    },
  ] as const;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <Image src={logoSrc} alt="Locatr logo" className="h-8 w-8" />
                <div className="grid text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Locatr</span>
                  <span className="truncate text-xs">Beta</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
