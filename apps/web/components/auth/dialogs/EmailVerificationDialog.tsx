'use client';

import { useCallback, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Loader2, Mail } from 'lucide-react';

import { resendVerificationEmailAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { resendVerificationMutationFunction } from '@/lib/api/auth.api';
import { getCaptchaToken } from '@/lib/utils/captcha';

import { useToast } from '@/hooks/use-toast';

import { CustomError } from '../ErrorArea';

interface EmailVerificationDialogProps {
  open: boolean;
  email: string;
  onCloseAction: () => void;
}

export function EmailVerificationDialog({
  open,
  email,
  onCloseAction,
}: EmailVerificationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: resendVerificationMutation } = useMutation({
    mutationFn: resendVerificationMutationFunction,
  });

  const handleError = useCallback(
    (error: unknown) => {
      const errorObj = error as CustomError;
      toast({
        title: 'Error',
        description: `${errorObj.message}`,
        variant: 'destructive',
      });
    },
    [toast]
  );

  const handleResend = async () => {
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

      await resendVerificationMutation({ email: email });

      toast({
        title: 'Verification Email Sent',
      });

      onCloseAction();
    } catch (error) {
      toast({
        title: 'Error',
        description: `${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>Email Verification Is Required</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <span className="text-secondary-foreground text-sm">
            We have sent a verification email to <strong>{email}</strong>.
          </span>
          <span className="text-secondary-foreground text-sm">
            Please check your inbox and click the link to verify your account. If you don’t see the
            email in your inbox, check your spam folder.
          </span>
        </div>
        <DialogFooter className="flex flex-col justify-between">
          <Button variant="outline" onClick={handleResend} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
