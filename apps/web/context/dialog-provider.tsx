'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import { EmailVerificationDialog } from '@/components/auth/dialogs/EmailVerificationDialog';
import { LoginMfaDialog } from '@/components/auth/dialogs/LoginMfaDialog';
import { AddDeviceDialog } from '@/components/dashboard/devices/dialogs/AddDeviceDialog';
import { ConfirmationDialog } from '@/components/dashboard/dialogs/ConfirmationDialog';
import { FeedbackDialog } from '@/components/dashboard/dialogs/FeedbackDialog';
import { SetupMfaDialog } from '@/components/dashboard/settings/security/dialogs/SetupMfaDialog';

import { DialogType } from '@/lib/types/dialog.type';

interface DialogPropsMap {
  emailVerification: { email: string };
  loginMfa: { email: string };
  setupMfa: Record<string, never>;
  confirmation: {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirmAction: () => Promise<void> | void;
  };
  addDevice: Record<string, never>;
  feedback: Record<string, never>;
}

type OpenDialogFunction = <T extends keyof DialogPropsMap>(
  type: T,
  props: DialogPropsMap[T]
) => void;

type DialogContextValue = {
  openDialog: OpenDialogFunction;
  closeDialog: () => void;
  currentDialog: DialogType;
  dialogProps: Partial<DialogPropsMap[keyof DialogPropsMap]>;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [currentDialog, setCurrentDialog] = useState<DialogType>(null);
  const [dialogProps, setDialogProps] = useState<Partial<DialogPropsMap[keyof DialogPropsMap]>>({});

  const openDialog: OpenDialogFunction = (type, props) => {
    setDialogProps(props);
    setCurrentDialog(type);
  };

  const closeDialog = () => {
    setCurrentDialog(null);
    setDialogProps({});
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, currentDialog, dialogProps }}>
      {children}
      <DialogRenderer />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within DialogProvider');
  return context;
}

function DialogRenderer() {
  const { currentDialog, dialogProps, closeDialog } = useDialog();

  switch (currentDialog) {
    case 'emailVerification':
      return (
        <EmailVerificationDialog
          open
          onCloseAction={closeDialog}
          email={(dialogProps as DialogPropsMap['emailVerification']).email}
        />
      );
    case 'loginMfa':
      return (
        <LoginMfaDialog
          open
          onCloseAction={closeDialog}
          email={(dialogProps as DialogPropsMap['loginMfa']).email}
        />
      );
    case 'setupMfa':
      return <SetupMfaDialog open onCloseAction={closeDialog} />;
    case 'confirmation':
      return (
        <ConfirmationDialog
          open
          onCloseAction={closeDialog}
          {...(dialogProps as DialogPropsMap['confirmation'])}
        />
      );
    case 'addDevice':
      return <AddDeviceDialog open onCloseAction={closeDialog} />;
    case 'feedback':
      return <FeedbackDialog open onCloseAction={closeDialog} />;

    default:
      return null;
  }
}
