'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import AccountTab from '@/components/dashboard/settings/AccountTab';
import NotificationsTab from '@/components/dashboard/settings/NotificationsTab';
import ProfileTab from '@/components/dashboard/settings/ProfileTab';
import SecurityTab from '@/components/dashboard/settings/SecurityTab';
import TitleCard from '@/components/dashboard/TitleCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'account', 'notifications', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <TitleCard title="Settings" description="Customize your account and preferences" />

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={(tab) => {
          setActiveTab(tab);
          router.push(`?tab=${tab}`);
        }}
        className="w-full"
      >
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <div className="overflow-y-auto">
          <TabsContent value="profile" className="space-y-4">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="account" className="space-y-4">
            <AccountTab />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <SecurityTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
