import { useAuthContext } from '@/context/auth-provider';

import TitleCard from '../TitleCard';
import EditProfileSection from './profile/EditProfileSection';
import UserInfoSection from './profile/UserInfoSection';

const ProfileTab = () => {
  const { user, refetch, isLoading } = useAuthContext();

  return (
    <div className="flex w-full flex-col gap-4 lg:w-3/4">
      <TitleCard
        title="Profile"
        description="Edit your personal information and profile details."
      />

      <UserInfoSection user={user} refetch={refetch} />

      <EditProfileSection user={user} isLoading={isLoading} refetch={refetch} />
    </div>
  );
};

export default ProfileTab;
