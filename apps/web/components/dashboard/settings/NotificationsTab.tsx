import { useMutation } from '@tanstack/react-query';
import { Bell, Mail } from 'lucide-react';

import { editNotificationPreferencesMutationFunction } from '@/lib/api/user.api';

import { useToast } from '@/hooks/use-toast';

import { useAuthContext } from '@/context/auth-provider';

import TitleCard from '../TitleCard';
import NotificationToggleCard from './notifications/NotificationToggleCard';

const NotificationsTab = () => {
  const { toast } = useToast();
  const { user, refetch } = useAuthContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: editNotificationPreferencesMutationFunction,
  });

  const handleToggle = async (key: 'email' | 'push', value: boolean) => {
    try {
      await mutateAsync({
        email: key === 'email' ? value : undefined,
        push: key === 'push' ? value : undefined,
      });

      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 lg:w-3/4">
      <TitleCard
        title="Notifications"
        description="Customize your notification preferences and choose how you want to stay informed."
      />

      <NotificationToggleCard
        icon={<Bell />}
        checked={user?.userPreferences.pushNotification ?? false}
        title="Push Notifications"
        description="Receive push notifications on your devices."
        onToggle={(val) => handleToggle('push', val)}
        disabled={isPending}
      />

      <NotificationToggleCard
        icon={<Mail />}
        checked={user?.userPreferences.emailNotification ?? true}
        title="Email Notifications"
        description="Receive email notifications about your account activity."
        onToggle={(val) => handleToggle('email', val)}
        disabled={isPending}
      />
    </div>
  );
};

export default NotificationsTab;
