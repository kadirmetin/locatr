'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { mfaSetupQueryFunction, mfaVerifyMutationFunction } from '@/lib/api/mfa.api';
import { mfaType } from '@/lib/types/mfa.type';

import { useToast } from '@/hooks/use-toast';

import { useAuthContext } from '@/context/auth-provider';

interface SetupMfaDialogProps {
  open: boolean;
  onCloseAction: () => void;
}

export function SetupMfaDialog({ open, onCloseAction }: SetupMfaDialogProps) {
  const [otp, setOtp] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { refetch } = useAuthContext();

  const { data, isLoading } = useQuery<mfaType>({
    queryKey: ['mfa-setup'],
    queryFn: mfaSetupQueryFunction,
    enabled: open,
    staleTime: Infinity,
  });

  const { mutateAsync: verifyMfa, isPending: isVerifying } = useMutation({
    mutationFn: mfaVerifyMutationFunction,
  });

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6 || !data?.secret) return;

    try {
      await verifyMfa({ code: otp, secretKey: data.secret });

      toast({
        title: 'MFA Enabled',
        description: 'MFA has been enabled successfully.',
      });

      queryClient.invalidateQueries({ queryKey: ['mfa-setup'] });
      refetch();
      onCloseAction();
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }, [otp, data?.secret, verifyMfa, toast, queryClient, refetch, onCloseAction]);

  const isSubmitDisabled = isLoading || isVerifying || otp.length !== 6;

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>Set Up Multi-Factor Authentication</DialogTitle>
          <DialogDescription>
            Protect your account by enabling multi-factor authentication (MFA).
          </DialogDescription>
        </DialogHeader>

        <div className="text-secondary-foreground grid gap-4 text-sm">
          <p>
            Scan the QR code with your authenticator app (e.g., Google Authenticator or Authy) and
            enter the 6-digit code.
          </p>

          <div className="flex justify-center">
            {isLoading ? (
              <div className="flex h-48 w-48 items-center justify-center">
                <Loader2 className="text-muted-foreground h-12 w-12 animate-spin" />
              </div>
            ) : data ? (
              <Collapsible className="flex flex-col items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <Image
                          src={data.qrImageUrl}
                          alt="MFA QR Code"
                          width={192}
                          height={192}
                          className="cursor-pointer rounded shadow"
                        />
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">Show setup key</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <CollapsibleContent>
                  <div className="bg-muted text-muted-foreground mt-2 rounded-md p-2 text-center text-xs">
                    Setup Key: <span className="text-primary font-mono">{data.secret}</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : null}
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleVerify();
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleVerify} disabled={isSubmitDisabled}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Enable'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
