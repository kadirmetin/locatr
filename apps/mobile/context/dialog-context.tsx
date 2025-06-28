import { createContext, ReactNode, useContext, useState } from "react";

interface DialogPropsMap {
  confirmation: {
    title: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirmAction?: () => Promise<void> | void;
    loadingText?: string;
  };
  error: {
    title: string;
    description?: React.ReactNode;
    onConfirmAction?: () => void | Promise<void>;
  };
  success: {
    title: string;
    description?: React.ReactNode;
    confirmText: string;
    onConfirmAction?: () => void | Promise<void>;
  };
  loginMfa: { email: string };
  emailVerification: { email: string };
}

type DialogState =
  | { type: "confirmation"; props: DialogPropsMap["confirmation"] }
  | { type: "error"; props: DialogPropsMap["error"] }
  | { type: "success"; props: DialogPropsMap["success"] }
  | { type: "loginMfa"; props: DialogPropsMap["loginMfa"] }
  | { type: "emailVerification"; props: DialogPropsMap["emailVerification"] }
  | { type: null; props: object };

type DialogPayload = Exclude<DialogState, { type: null }>;
type OpenDialog = (payload: DialogPayload) => void;

const DialogContext = createContext<
  | {
      dialog: DialogState;
      openDialog: OpenDialog;
      closeDialog: () => void;
    }
  | undefined
>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogState>({ type: null, props: {} });

  const openDialog: OpenDialog = (payload) => setDialog(payload);
  const closeDialog = () => setDialog({ type: null, props: {} });

  return (
    <DialogContext.Provider value={{ dialog, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}
