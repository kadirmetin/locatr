'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { resetPasswordAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { resetPasswordMutationFunction } from '@/lib/api/auth.api';
import {
  ResetPasswordFormSchema,
  ResetPasswordFormValues,
} from '@/lib/schemas/reset-password-schema';
import { getCaptchaToken } from '@/lib/utils/captcha';

import { useToast } from '@/hooks/use-toast';

interface ResetPasswordFormProps {
  verificationCode: string;
  exp: string;
}

interface CustomError {
  message: string;
  data?: {
    errors?: string[];
  };
}

const ResetPasswordForm = ({ verificationCode }: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<CustomError | undefined>(undefined);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: '',
      verificationCode: verificationCode,
    },
    mode: 'onChange',
  });

  const resetMutation = useMutation({
    mutationFn: resetPasswordMutationFunction,
    onSuccess: () => {
      form.reset();

      toast({
        title: 'Password reset successful!',
        description: 'You can now login with your new password.',
      });

      router.replace('/auth/login');
    },
    onError: (error: Error) => {
      setError({
        message: error.message || 'Something went wrong. Please try again.',
      });
    },
  });

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const errorObj = error as CustomError;
    setError({
      ...errorObj,
      message: customMessage || errorObj.message,
    });
  }, []);

  const onSubmit = useCallback(
    async (values: ResetPasswordFormValues) => {
      setError(undefined);

      try {
        const captchaToken = await getCaptchaToken('reset-password');
        const captchaResult = await resetPasswordAction(captchaToken);

        if (!captchaResult.success) {
          handleError({
            message: captchaResult.message,
            data: { errors: captchaResult.errors },
          } as CustomError);
          return;
        }

        await resetMutation.mutateAsync(values);
      } catch (error) {
        console.error('Reset password error:', error);
        handleError(error, 'An unexpected error occurred. Please try again.');
      }
    },
    [resetMutation, handleError]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" name="verificationCode" value={verificationCode} />

        {error && (
          <div className="bg-destructive/15 rounded-md p-3">
            <p className="text-destructive text-sm">{error.message}</p>
            {error.data?.errors && error.data.errors.length > 0 && (
              <ul className="text-destructive text-sm mt-2 list-disc list-inside">
                {error.data.errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full transition-all"
          disabled={resetMutation.isPending || !form.formState.isValid}
        >
          {resetMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
