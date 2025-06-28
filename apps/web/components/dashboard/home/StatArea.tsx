import { Activity, MapPin, Smartphone } from 'lucide-react';

import StatCard from './StatCard';

interface StatAreaProps {
  totalLocations: number;
  activeDevices: number;
  recentActivities: number;
  isLoadingLocations?: boolean;
  isLoadingDevices?: boolean;
  isLoadingActivities?: boolean;
}

const StatArea = ({
  totalLocations,
  activeDevices,
  recentActivities,
  isLoadingLocations = false,
  isLoadingDevices = false,
  isLoadingActivities = false,
}: StatAreaProps) => {
  const stats = [
    {
      icon: MapPin,
      label: 'Total Locations',
      value: totalLocations,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      isLoading: isLoadingLocations,
    },
    {
      icon: Smartphone,
      label: 'Active Devices',
      value: activeDevices,
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
      isLoading: isLoadingDevices,
    },
    {
      icon: Activity,
      label: 'Recent Activities',
      value: recentActivities,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      isLoading: isLoadingActivities,
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </>
  );
};

export default StatArea;
