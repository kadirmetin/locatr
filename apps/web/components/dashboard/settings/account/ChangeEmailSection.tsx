'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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

import { changeEmailMutationFunction } from '@/lib/api/auth.api';
import { ChangeEmailFormValues, getChangeEmailSchema } from '@/lib/schemas/change-email-schema';
import { UserType } from '@/lib/types/user.type';

import { useToast } from '@/hooks/use-toast';

interface ChangeEmailSectionProps {
  user: UserType;
  isLoading: boolean;
}

const ChangeEmailSection = ({ user, isLoading }: ChangeEmailSectionProps) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: changeEmailMutationFunction,
  });
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(getChangeEmailSchema(user?.email || '')),
    defaultValues: { newEmail: user?.email || '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangeEmailFormValues) => {
    try {
      await mutateAsync(data);

      toast({
        title: 'Email updated successfully!',
        description:
          "We've sent you a verification link. You can now log in using your new email address.",
      });

      router.replace('/auth/login');
    } catch (error) {
      const message =
        (error as Error)?.message || 'An unexpected error occurred while updating your email.';

      toast({
        variant: 'destructive',
        title: 'Update failed!',
        description: message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email Address</CardTitle>
        <CardDescription>Change the email linked to your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading || isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Change Email Adress'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangeEmailSection;
