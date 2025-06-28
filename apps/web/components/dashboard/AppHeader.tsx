'use client';

import * as React from 'react';
import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { generateBreadcrumbsFromPath } from '@/lib/utils/generateBreadcrumbsFromPath';

import {
  BreadcrumbItem as BreadcrumbItemInterface,
  useBreadcrumb,
} from '@/context/breadcrumb-provider';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItemInterface[];
}

const AppHeader = ({ breadcrumbs }: AppHeaderProps) => {
  const pathname = usePathname();
  const { breadcrumbs: contextBreadcrumbs } = useBreadcrumb();

  const defaultBreadcrumbs = useMemo(() => {
    return breadcrumbs
      ? breadcrumbs
      : contextBreadcrumbs.length > 0
        ? contextBreadcrumbs
        : generateBreadcrumbsFromPath(pathname);
  }, [breadcrumbs, contextBreadcrumbs, pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {defaultBreadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className="hidden md:block">
                  {item.isCurrentPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href || '#'}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default AppHeader;
