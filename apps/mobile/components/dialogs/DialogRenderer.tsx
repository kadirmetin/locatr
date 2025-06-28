import { useDialog } from "~/context/dialog-context";

import { ConfirmationDialog } from "./ConfirmationDialog";
import { EmailVerificationDialog } from "./EmailVerificationDialog";
import { ErrorDialog } from "./ErrorDialog";
import { LoginMfaDialog } from "./LoginMfaDialog";
import { SuccessDialog } from "./SuccessDialog";

export function DialogRenderer() {
  const { dialog, closeDialog } = useDialog();

  switch (dialog.type) {
    case "confirmation":
      return (
        <ConfirmationDialog
          open
          onCloseAction={closeDialog}
          {...dialog.props}
        />
      );

    case "error":
      return <ErrorDialog open onCloseAction={closeDialog} {...dialog.props} />;

    case "success":
      return (
        <SuccessDialog open onCloseAction={closeDialog} {...dialog.props} />
      );

    case "loginMfa":
      return (
        <LoginMfaDialog open onCloseAction={closeDialog} {...dialog.props} />
      );

    case "emailVerification":
      return (
        <EmailVerificationDialog
          open
          onCloseAction={closeDialog}
          {...dialog.props}
        />
      );

    default:
      return null;
  }
}
