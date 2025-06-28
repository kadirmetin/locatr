import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { UserType } from '@/lib/types/user.type';

import { EditProfileForm } from './EditProfileForm';

interface EditProfileSectionProps {
  user: UserType;
  isLoading?: boolean;
  refetch: () => void;
}

const EditProfileSection = ({ user, isLoading = false, refetch }: EditProfileSectionProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-4 md:flex-row md:items-stretch">
      <Card className="mx-auto w-full p-6">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update only the fields you want to change.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <EditProfileForm initialData={user} isLoading={isLoading} refetch={refetch} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfileSection;
