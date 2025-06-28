'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { deleteAccountQueryFunction } from '@/lib/api/auth.api';
import { UserType } from '@/lib/types/user.type';

import { useToast } from '@/hooks/use-toast';

import { useDialog } from '@/context/dialog-provider';

interface DeleteAccountSectionProps {
  user: UserType;
  isLoading: boolean;
}

const DeleteAccountSection = ({ isLoading }: DeleteAccountSectionProps) => {
  const { openDialog } = useDialog();
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: deleteAccountQueryFunction,
  });

  const onSubmit = () => {
    openDialog('confirmation', {
      onConfirmAction: async () => {
        try {
          await mutateAsync();

          toast({
            title: "We're sorry to see you go.",
            description: 'Your account has been deleted.',
          });

          router.replace('/auth/login');
        } catch (error) {
          toast({
            title: 'Something went wrong.',
            description: `${(error as Error).message || 'Please try again later.'}`,
            variant: 'destructive',
          });
        }
      },
      title: 'Delete Account',
      description: 'Are you sure you want to delete your account?',
      confirmText: 'Delete Account',
      isDestructive: true,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          This action is <strong>permanent</strong>. All your data will be removed after your
          account is deleted.
        </CardDescription>
      </CardHeader>

      <CardContent />

      <CardFooter className="flex justify-end">
        <Button variant="destructive" disabled={isLoading} onClick={onSubmit}>
          Delete Account
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeleteAccountSection;
