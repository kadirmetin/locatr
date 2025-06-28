import React, { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, RefreshCw, ShieldAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import {
  deleteAllSessionsMutationFunction,
  deleteSessionMutationFunction,
  getAllSessionsQueryFunction,
} from '@/lib/api/session.api.';
import { SessionType } from '@/lib/types/session.type';

import { useToast } from '@/hooks/use-toast';

import SessionItem from './SessionItem';
import SessionSkeleton from './skeletons/SessionSkeleton';

const SessionsSection = React.memo(() => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [isTerminatingAll, setIsTerminatingAll] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessionsQueryFunction,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const sessions = data?.sessions ?? ([] as SessionType[]);
  const currentSession = sessions.find((session) => session.isCurrent);
  const otherSessions = sessions.filter((session) => !session.isCurrent);

  const deleteSessionMutation = useMutation({
    mutationFn: deleteSessionMutationFunction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const deleteAllSessionsMutation = useMutation({
    mutationFn: deleteAllSessionsMutationFunction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await deleteSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error('Error terminating session', error);
    }
  };

  const handleTerminateAllSessions = async (userId: string, currentSessionId: string) => {
    setIsTerminatingAll(true);

    try {
      await deleteAllSessionsMutation.mutateAsync({
        userId,
        currentSessionId,
      });
    } catch (error) {
      console.error('Error terminating all sessions', error);
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsTerminatingAll(false);
      setIsDialogOpen(false);
    }
  };

  const handleRefresh = () => refetch();

  const renderCurrentSession = () =>
    currentSession && (
      <div className="space-y-2">
        <h3 className="flex items-center gap-1 text-sm font-medium">
          <Check className="text-primary h-4 w-4" />
          Current Session
        </h3>
        <SessionItem
          session={currentSession}
          isCurrentUser={true}
          onTerminate={handleTerminateSession}
        />
      </div>
    );

  const renderOtherSessions = () =>
    otherSessions.length > 0 && (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Other Active Sessions ({otherSessions.length})</h3>
        <div className="space-y-3">
          {(showAllSessions ? otherSessions : otherSessions.slice(0, 2)).map((session) => (
            <SessionItem
              key={session._id}
              session={session}
              isCurrentUser={false}
              onTerminate={handleTerminateSession}
            />
          ))}

          {otherSessions.length > 2 && !showAllSessions && (
            <Button
              variant="ghost"
              className="text-primary w-full"
              onClick={() => setShowAllSessions(true)}
            >
              Show {otherSessions.length - 2} more sessions
            </Button>
          )}
        </div>
      </div>
    );

  const renderSessionsContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <SessionSkeleton />
          <SessionSkeleton />
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>No active sessions</AlertTitle>
          <AlertDescription>
            There are currently no active sessions for your account.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <Alert>
          <ShieldAlert className="h-8 w-8" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            For your account security, review all active sessions. If you don&apos;t recognize a
            session, terminate it immediately and change your password.
          </AlertDescription>
        </Alert>

        {renderCurrentSession()}
        {renderOtherSessions()}
      </>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage devices and browsers currently logged into your account.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading || isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">{renderSessionsContent()}</CardContent>

      <Separator />

      <CardFooter className="flex justify-end py-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              disabled={isTerminatingAll || otherSessions.length === 0}
            >
              {isTerminatingAll ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Terminating...
                </>
              ) : (
                'Terminate All Other Sessions'
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="[&>button:last-child]:hidden">
            <DialogHeader>
              <DialogTitle>Terminate All Sessions</DialogTitle>
              <DialogDescription>
                This will terminate all sessions except your current one. You will be logged out of
                all other devices.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground text-sm">
                Are you sure you want to proceed? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  handleTerminateAllSessions(
                    data?.sessions[0]?.userId ?? 'defaultUserId',
                    data?.sessions[0]?._id ?? 'defaultSessionId'
                  );
                }}
                disabled={isTerminatingAll}
              >
                {isTerminatingAll ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Terminating...
                  </>
                ) : (
                  'Yes, Terminate All'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
});

SessionsSection.displayName = 'SessionsSection';

export default SessionsSection;
