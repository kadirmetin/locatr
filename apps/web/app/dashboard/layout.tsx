import type { Metadata } from 'next';

import AppHeader from '@/components/dashboard/AppHeader';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import DashboardLoader from '@/components/dashboard/DashboardLoader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { AuthProvider } from '@/context/auth-provider';
import { BreadcrumbProvider } from '@/context/breadcrumb-provider';
import { DialogProvider } from '@/context/dialog-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    template: '%s | Locatr',
    default: 'Dashboard',
  },
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <AuthProvider>
      <DashboardLoader>
        <BreadcrumbProvider>
          <DialogProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <AppHeader />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </DialogProvider>
        </BreadcrumbProvider>
      </DashboardLoader>
    </AuthProvider>
  );
};

export default DashboardLayout;
