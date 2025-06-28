'use client';

import { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Loader2, MoveLeft, ShieldCheck } from 'lucide-react';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const exp = searchParams.get('exp');
  const now = Date.now();
  const router = useRouter();

  const isValidRequest = useMemo(() => {
    return Boolean(code && exp && Number(exp) > now);
  }, [code, exp, now]);

  useEffect(() => {
    if (!isValidRequest) {
      const redirectTimer = setTimeout(() => {
        router.replace('/auth/forgot-password');
      }, 2000);
      return () => clearTimeout(redirectTimer);
    }
  }, [isValidRequest, router]);

  if (!isValidRequest) {
    return (
      <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Invalid Request</CardTitle>
            <CardDescription>
              Authentication parameters are missing, or the link has expired. Redirecting to
              password reset request page...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-32 w-full items-center justify-center">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-primary h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          </div>
          <CardDescription>Create a strong new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm verificationCode={code!} exp={exp!} />
        </CardContent>
        <CardFooter>
          <Button variant="link" asChild className="flex w-full items-center justify-center gap-2">
            <Link href="/auth/login">
              <MoveLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
