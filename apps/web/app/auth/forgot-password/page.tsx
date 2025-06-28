'use client';

import Link from 'next/link';

import { MoveLeft } from 'lucide-react';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import TopHomeButton from '@/components/auth/TopHomeButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <TopHomeButton />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="link" asChild className="p-0">
            <Link href="/auth/login">
              <MoveLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
