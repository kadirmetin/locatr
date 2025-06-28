import { BreadcrumbItem as BreadcrumbItemInterface } from '@/context/breadcrumb-provider';

const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItemInterface[] => {
  if (pathname === '/') {
    return [{ label: 'Home', href: '/', isCurrentPage: true }];
  }

  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'dashboard') {
    const breadcrumbs: BreadcrumbItemInterface[] = [{ label: 'Dashboard', href: '/dashboard' }];

    for (let index = 1; index < segments.length; index++) {
      const segment = segments[index];
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: isLast ? undefined : path,
        isCurrentPage: isLast,
      });
    }

    return breadcrumbs;
  }

  return [{ label: 'Dashboard', href: '/dashboard', isCurrentPage: true }];
};

export { generateBreadcrumbsFromPath };
