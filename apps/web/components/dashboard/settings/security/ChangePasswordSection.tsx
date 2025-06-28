'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { changePasswordMutationFunction } from '@/lib/api/auth.api';
import {
  changePasswordFormSchema,
  ChangePasswordFormValues,
} from '@/lib/schemas/change-password-schema';

import { useToast } from '@/hooks/use-toast';

import { useDialog } from '@/context/dialog-provider';

const ChangePasswordSection = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { openDialog } = useDialog();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: changePasswordMutationFunction,
  });

  const passwordChangeForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    openDialog('confirmation', {
      onConfirmAction: async () => {
        try {
          await mutateAsync({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          });

          toast({
            title: 'Password Updated',
            description:
              'Your password has been successfully updated. You can now log in with your new password.',
          });

          passwordChangeForm.reset();

          router.replace('/auth/login');
        } catch (error) {
          console.error(error);

          toast({
            title: 'Error',
            description: (error as Error).message,
            variant: 'destructive',
          });
        }
      },
      title: 'Change password',
      description: 'Are you sure you want to change your password?',
      confirmText: 'Change Password',
    });
  };

  return (
    <Card>
      <Form {...passwordChangeForm}>
        <form onSubmit={passwordChangeForm.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password. Choose a strong, unique password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={passwordChangeForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordChangeForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordChangeForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isPending}>
              Change Password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ChangePasswordSection;
