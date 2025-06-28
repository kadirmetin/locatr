import Link from 'next/link';

import type { TablerIcon } from '@tabler/icons-react';
import type { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavSecondaryItem {
  title: string;
  icon: LucideIcon | TablerIcon;
  url?: string;
  onClick?: () => void;
}

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: readonly NavSecondaryItem[];
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                {item.url ? (
                  <Link href={item.url} target="_blank" prefetch={false} rel="noreferrer noopener">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <button type="button" onClick={item.onClick} className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.title}</span>
                  </button>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
