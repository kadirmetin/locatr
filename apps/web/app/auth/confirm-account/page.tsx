'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { Check, Loader2, XCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { confirmAccountMutationFunction } from '@/lib/api/auth.api';

import { useToast } from '@/hooks/use-toast';

export default function ConfirmAccountPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();
  const isValidRequest = Boolean(code);
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: confirmAccountMutationFunction,
  });

  useEffect(() => {
    if (!code) {
      const redirectTimer = setTimeout(() => {
        router.replace('/auth/login');
      }, 2000);

      return () => clearTimeout(redirectTimer);
    } else {
      const confirm = async () => {
        try {
          await mutateAsync(code);

          setIsSuccess(true);
        } catch (error) {
          console.error(error);

          setIsError(true);

          setTimeout(() => {
            router.replace('/auth/login');
          }, 3000);
        }
      };
      confirm();
    }
  }, [code, router, mutateAsync, toast]);

  if (!isValidRequest || (!isSuccess && isPending)) {
    return (
      <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isValidRequest ? 'Verifying Account...' : 'Invalid Request'}
            </CardTitle>
            <CardDescription>
              {isValidRequest
                ? 'Please wait while we confirm your account.'
                : 'Verification parameters are missing. Redirecting to login page...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-32 w-full items-center justify-center">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="text-destructive flex items-center space-x-2">
              <XCircle className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
            </div>
            <CardDescription>
              Something went wrong during the verification process. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            If you&apos;re not redirected,{' '}
            <Link href="/auth/login" className="text-primary underline hover:underline">
              click here to go to login
            </Link>
            .
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Check className="text-primary h-6 w-6" />
              <CardTitle className="text-2xl font-bold">Account Verified Successfully</CardTitle>
            </div>
            <CardDescription>Your account has been verified. You can now log in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login" className="text-primary text-sm underline hover:underline">
              Go to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
