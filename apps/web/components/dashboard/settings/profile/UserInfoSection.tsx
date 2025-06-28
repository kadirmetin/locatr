import { ImageUp, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from '@/components/ui/image';
import Uploader from '@/components/ui/uploader';

import { UserType } from '@/lib/types/user.type';

interface UserInfoSectionProps {
  user: UserType;
  refetch: () => void;
}

const UserInfoSection = ({ user, refetch }: UserInfoSectionProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-4 md:flex-row md:items-stretch">
      <Card className="flex flex-col items-center justify-center p-2">
        <CardContent>
          <Uploader refetch={refetch}>
            <div className="group relative mx-auto flex items-center justify-center">
              {user?.avatar ? (
                <div className="h-60 w-60">
                  <Image
                    alt="Profile picture"
                    src={user.avatar}
                    width={240}
                    height={240}
                    className="h-full w-full rounded-full object-cover shadow-md"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                </div>
              ) : (
                <div className="bg-muted flex h-60 w-60 items-center justify-center rounded-full border shadow-md">
                  <User className="text-foreground h-32 w-32" />
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ImageUp className="h-12 w-12 text-white" />
                <span className="sr-only">Change profile picture</span>
              </div>
            </div>
          </Uploader>
        </CardContent>
      </Card>

      <Card className="flex h-full w-full flex-col justify-center p-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">User Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col">
            <p className="text-muted-foreground text-sm">Name Surname</p>
            <p className="text-base font-medium">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground text-sm">Email Address</p>
            <p className="text-base font-medium">{user?.email}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-muted-foreground text-sm">Bio</p>
            <p className={`text-base font-medium ${user?.bio ? '' : 'text-muted-foreground'}`}>
              {user?.bio ? user.bio : 'Nothing to share here yet.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInfoSection;
