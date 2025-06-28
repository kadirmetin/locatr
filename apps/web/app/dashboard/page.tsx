'use client';

import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';

import { BetaDialog } from '@/components/dashboard/dialogs/BetaDialog';
import MiniMap from '@/components/dashboard/home/MiniMap';
import QuickActionsArea from '@/components/dashboard/home/QuickActionsArea';
import RecentActivitiesArea from '@/components/dashboard/home/RecentActivitiesArea';
import StatArea from '@/components/dashboard/home/StatArea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getAllDevicesQueryFunction } from '@/lib/api/device.api';
import { getAllLocationsQueryFunction, getRecentActivities } from '@/lib/api/location.api';

import { useAuthContext } from '@/context/auth-provider';

const DashboardPage = () => {
  const { user } = useAuthContext();

  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocationsQueryFunction,
  });

  const { data: devices, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: getAllDevicesQueryFunction,
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: getRecentActivities,
  });

  const locationsData = locations?.length || 0;
  const devicesData = devices?.length || 0;
  const activitiesData = activities?.count || 0;

  return (
    <div className="space-y-6 p-4 pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back {user?.firstName} <span className="text-4xl">👋</span>
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your{' '}
            <span className="font-semibold">Locatr</span>.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatArea
          totalLocations={locationsData}
          activeDevices={devicesData}
          recentActivities={activitiesData}
          isLoadingLocations={isLoadingLocations}
          isLoadingDevices={isLoadingDevices}
          isLoadingActivities={isLoadingActivities}
        />
      </div>

      {/* Quick Actions */}
      <QuickActionsArea />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Recent Activities */}
        <RecentActivitiesArea
          activities={activities?.activities ?? []}
          isLoading={isLoadingActivities}
        />
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Location Map
          </CardTitle>
          <CardDescription>Real-time view of all tracked locations</CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          <MiniMap />
        </CardContent>
      </Card>
      <BetaDialog />
    </div>
  );
};

export default DashboardPage;
