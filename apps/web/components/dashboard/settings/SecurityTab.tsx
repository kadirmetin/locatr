'use client';

import { useAuthContext } from '@/context/auth-provider';

import TitleCard from '../TitleCard';
import ChangePasswordSection from './security/ChangePasswordSection';
import MFASection from './security/MFASection';
import SessionsSection from './security/SessionsSection';

const SecurityTab = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex w-full flex-col gap-4 lg:w-3/4">
      <TitleCard
        title="Security"
        description="Manage your security settings to protect your account."
      />

      <ChangePasswordSection />

      <MFASection isMfaEnabled={user?.userPreferences.enable2FA ?? false} />

      <SessionsSection />
    </div>
  );
};

export default SecurityTab;
