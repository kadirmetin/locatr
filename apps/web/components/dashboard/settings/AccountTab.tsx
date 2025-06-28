import { useAuthContext } from '@/context/auth-provider';

import TitleCard from '../TitleCard';
import ChangeEmailSection from './account/ChangeEmailSection';
import ChangeLanguageSection from './account/ChangeLanguageSection';
import DeleteAccountSection from './account/DeleteAccountSection';

const AccountTab = () => {
  const { user, isLoading } = useAuthContext();

  return (
    <div className="flex w-full flex-col gap-4 lg:w-3/4">
      <TitleCard title="Account" description="Manage your account settings and email address." />

      <ChangeEmailSection user={user} isLoading={isLoading} />

      <ChangeLanguageSection />

      <DeleteAccountSection user={user} isLoading={isLoading} />
    </div>
  );
};

export default AccountTab;
