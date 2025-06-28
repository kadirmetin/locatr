'use client';

import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

import { forgotPasswordAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { forgotPasswordMutationFunction } from '@/lib/api/auth.api';
import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormValues,
} from '@/lib/schemas/forgot-password-schema';
import { getCaptchaToken } from '@/lib/utils/captcha';

type CustomError = {
  message: string;
  data?: { errors?: string[] };
};

const ForgotPasswordForm = () => {
  const [status, setStatus] = useState<{
    error?: string;
    success?: string;
  }>({});

  const { mutateAsync, isPending } = useMutation({
    mutationFn: forgotPasswordMutationFunction,
  });

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const errorObj = error as CustomError;
    setStatus({
      error: customMessage || errorObj.message || 'Something went wrong.',
    });
  }, []);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setStatus({});

      const captchaToken = await getCaptchaToken('forgot-password');
      const captchaResult = await forgotPasswordAction(captchaToken);

      if (!captchaResult.success) {
        handleError({
          message: captchaResult.message,
          data: { errors: captchaResult.errors },
        } as CustomError);
        return;
      }

      await mutateAsync(values);

      setStatus({
        success: 'Reset link sent! Please check your email.',
      });

      methods.reset();
    } catch (error) {
      console.error('Forgot password error:', error);
      handleError(error);
    }
  };

  if (status.success) {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm text-green-600">{status.success}</p>
        <p className="text-xs text-muted-foreground">
          If you don&apos;t see the email, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  {...field}
                  className={errors.email ? 'border-red-500' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status.error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {status.error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
