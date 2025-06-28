'use client';

import { useRouter } from 'next/navigation';

import { Navigation, PlusCircle, Send, Settings, Smartphone } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useDialog } from '@/context/dialog-provider';

import QuickActionButton from './QuickActionButton';

const QuickActionsArea = () => {
  const router = useRouter();
  const { openDialog } = useDialog();

  const actions = [
    {
      icon: PlusCircle,
      label: 'Add Device',
      onClick: () => {
        openDialog('addDevice', {});
      },
    },
    {
      icon: Smartphone,
      label: 'Manage Devices',
      onClick: () => {
        router.push('/dashboard/devices');
      },
    },
    {
      icon: Send,
      label: 'Give Feedback',
      onClick: () => {
        openDialog('feedback', {});
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        router.push('/dashboard/settings');
      },
    },
  ];
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Frequently used actions for location management</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {actions.map(({ icon, label, onClick }) => (
            <QuickActionButton key={label} icon={icon} label={label} onClick={onClick} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsArea;
