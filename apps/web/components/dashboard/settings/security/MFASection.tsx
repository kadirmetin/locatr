import { useMutation } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import { mfaDisableMutationFunction } from '@/lib/api/mfa.api';

import { useToast } from '@/hooks/use-toast';

import { useAuthContext } from '@/context/auth-provider';
import { useDialog } from '@/context/dialog-provider';

interface MFASectionProps {
  isMfaEnabled: boolean;
}

const MFASection = ({ isMfaEnabled }: MFASectionProps) => {
  const { openDialog } = useDialog();
  const { refetch } = useAuthContext();
  const { toast } = useToast();

  const { mutateAsync: disableMfa } = useMutation({
    mutationFn: mfaDisableMutationFunction,
  });

  const handleDisableMfa = async () => {
    try {
      await disableMfa();

      toast({
        title: 'Multi-Factor Authentication Disabled',
        description: 'All your sessions have been terminated.',
      });

      refetch();
    } catch (error) {
      console.error(error);

      toast({
        title: 'Error',
        description: `${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleTwoFactorToggle = () => {
    if (isMfaEnabled) {
      openDialog('confirmation', {
        onConfirmAction: handleDisableMfa,
        title: 'Disable Multi-Factor Authentication',
        description:
          'Are you sure you want to disable multi-factor authentication? All your sessions will be terminated.',
        confirmText: 'Disable',
        isDestructive: true,
      });
    } else {
      openDialog('setupMfa', {});
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication (MFA)</CardTitle>
        <CardDescription>Add an extra layer of security to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Enable MFA</span>
            <span className="text-muted-foreground text-xs">
              Protect your account by enabling multi-factor authentication (MFA).
            </span>
          </div>
          <Switch
            checked={isMfaEnabled}
            onCheckedChange={handleTwoFactorToggle}
            aria-label="Toggle Two-Factor Authentication"
          />
        </div>
      </CardContent>
      {isMfaEnabled && (
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            2FA is currently enabled. You might need to configure it further using an authenticator
            app.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default MFASection;
