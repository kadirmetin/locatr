'use client';

import { useCallback, useRef, useState } from 'react';

import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { MoveLeft } from 'lucide-react';

import { registerAction, resendVerificationEmailAction } from '@/app/actions';

import { CustomError } from '@/components/auth/ErrorArea';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import TopHomeButton from '@/components/auth/TopHomeButton';
import { MailCheckIcon } from '@/components/ui/animated-icons/mail-check';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { registerMutationFunction, resendVerificationMutationFunction } from '@/lib/api/auth.api';
import { SignUpFormValues } from '@/lib/schemas/sign-up-schema';
import { getCaptchaToken } from '@/lib/utils/captcha';

import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [error, setError] = useState<CustomError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userEmail = useRef('');
  const { toast } = useToast();

  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: registerMutationFunction,
    onError: (error) => setError(error as CustomError),
    onSettled: () => setIsLoading(false),
  });

  const { mutateAsync: resendVerificationMutation } = useMutation({
    mutationFn: resendVerificationMutationFunction,
    onError: (error) => {
      toast({
        title: 'Error',
        description: `${(error as Error).message}`,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Verification Email Sent',
      });
    },
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
    async (values: SignUpFormValues) => {
      setError(undefined);
      setIsLoading(true);
      userEmail.current = values.email;

      try {
        const captchaToken = await getCaptchaToken('register');
        const captchaResult = await registerAction(captchaToken);

        if (!captchaResult.success) {
          handleError({
            message: captchaResult.message,
            data: { errors: captchaResult.errors },
          } as CustomError);
          return;
        }

        await registerMutation(values);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
    [registerMutation, handleError]
  );

  const resendVerificationEmail = useCallback(async () => {
    setIsLoading(true);

    try {
      const captchaToken = await getCaptchaToken('resend_verification');
      const captchaResult = await resendVerificationEmailAction(captchaToken);

      if (!captchaResult.success) {
        handleError({
          message: captchaResult.message,
          data: { errors: captchaResult.errors },
        } as CustomError);
        return;
      }
      await resendVerificationMutation({ email: userEmail.current });
    } catch (error) {
      console.error('Resend verification error:', error);
    }
  }, [handleError, resendVerificationMutation]);

  const handleBackToLogin = useCallback(() => {
    setIsSubmitted(false);
    setError(undefined);
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    setError(undefined);
    // TODO: Add google login implementation
  }, []);

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <TopHomeButton />

      {!isSubmitted ? (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Enter your email to get started and create your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <RegisterForm
              onSubmitAction={onSubmit}
              submitButtonText="Register"
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

            <SocialLoginButtons onGoogleClick={handleGoogleLogin} isLoading={isLoading} />
          </CardContent>

          <CardFooter className="flex flex-col items-start justify-center gap-4">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary underline-offset-4 transition-colors hover:underline"
              >
                Login
              </Link>
            </p>

            <p className="w-full text-center text-sm text-gray-500">
              By continuing, you agree to our <br />
              <Link target="_blank" href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link target="_blank" href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md rounded-2xl p-6">
          <CardHeader className="space-y-3 text-center">
            <MailCheckIcon className="text-primary mx-auto" size={72} />
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              We&apos;ve sent a verification email to your address.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-center">
            <p className="text-muted-foreground text-sm">
              Please check your inbox and click the link to verify your account. Make sure to check
              your spam folder.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              variant="default"
              className="w-full tracking-wide"
              onClick={resendVerificationEmail}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <Link
              href="/auth/login"
              className="text-primary flex flex-row items-center gap-2 text-center text-sm hover:underline"
              onClick={handleBackToLogin}
            >
              <MoveLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
