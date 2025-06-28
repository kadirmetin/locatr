'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Clock, Loader2, Send } from 'lucide-react';

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

import { feedbackMutationFunction } from '@/lib/api/feedback.api';
import { FeedbackFormData } from '@/lib/schemas/feedback-schema';

import { useCountdown } from '@/hooks/use-countdown';
import { useToast } from '@/hooks/use-toast';

import { useAuthContext } from '@/context/auth-provider';

import { FeedbackForm } from '../FeedbackForm';

interface FeedbackDialogProps {
  open: boolean;
  onCloseAction: () => void;
}

const COOLDOWN_SECONDS = 180;
const COOLDOWN_STORAGE_KEY = 'feedbackCooldownEndTime';

export function FeedbackDialog({ open, onCloseAction }: FeedbackDialogProps) {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { mutateAsync } = useMutation({ mutationFn: feedbackMutationFunction });
  const {
    formattedTime,
    isActive: isCooldownActive,
    start: startCooldown,
  } = useCountdown(COOLDOWN_SECONDS, COOLDOWN_STORAGE_KEY);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: FeedbackFormData) => {
    setIsLoading(true);
    try {
      const { data } = await mutateAsync({
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email as string,
        feedback: values,
      });

      toast({
        title: 'Feedback sent!',
        description: data.message,
      });

      startCooldown();
      onCloseAction();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts, reporting bugs, or suggesting new features.
          </DialogDescription>
        </DialogHeader>

        <FeedbackForm onSubmit={handleSubmit}>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="secondary" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || isCooldownActive}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : isCooldownActive ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Please wait ({formattedTime})</span>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  <span>Send Feedback</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </FeedbackForm>
      </DialogContent>
    </Dialog>
  );
}
