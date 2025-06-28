'use client';

import { useCallback, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { loginAction } from '@/app/actions';

import { CustomError } from '@/components/auth/ErrorArea';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import TopHomeButton from '@/components/auth/TopHomeButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { loginMutationFunction } from '@/lib/api/auth.api';
import { SignInFormValues } from '@/lib/schemas/sign-in-schema';
import { getCaptchaToken } from '@/lib/utils/captcha';

import { useDialog } from '@/context/dialog-provider';

export default function LoginPage() {
  const [error, setError] = useState<CustomError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { openDialog } = useDialog();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: loginMutationFunction,
    onError: (error) => setError(error as CustomError),
    onSettled: () => setIsLoading(false),
  });

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const errorObj = error as CustomError;
    setError({
      ...errorObj,
      message: customMessage || errorObj.message,
    });
  }, []);

  const onSubmit = useCallback(
    async (values: SignInFormValues) => {
      setError(undefined);
      setIsLoading(true);

      try {
        const captchaToken = await getCaptchaToken('login');
        const captchaResult = await loginAction(captchaToken);

        if (!captchaResult.success) {
          handleError({
            message: captchaResult.message,
            data: { errors: captchaResult.errors },
          } as CustomError);
          return;
        }

        const { data } = await mutateAsync(values);
        const { isEmailVerified, mfaRequired } = data;

        if (!isEmailVerified) {
          openDialog('emailVerification', { email: values.email });
          return;
        }

        if (mfaRequired) {
          openDialog('loginMfa', { email: values.email });
          return;
        }

        router.replace('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    [mutateAsync, openDialog, router, handleError]
  );

  const handleGoogleLogin = useCallback(async () => {
    setError(undefined);
    // TODO: Add google login implementation
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <TopHomeButton />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LoginForm
            onSubmitAction={onSubmit}
            submitButtonText="Login"
            isLoading={isLoading}
            error={error}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative text-center text-sm">
              <span className="bg-card text-muted-foreground px-2">Or continue with</span>
            </div>
          </div>

          <SocialLoginButtons onGoogleClick={handleGoogleLogin} isLoading={false} />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Don&#39;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
