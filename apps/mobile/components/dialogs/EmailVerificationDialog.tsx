import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";

import { resendVerificationCodeMutationFunction } from "~/api/auth.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Text } from "~/components/ui/text";
import { useDialog } from "~/context/dialog-context";
import { useCooldown } from "~/hooks/use-cooldown";
import { useErrorHandler } from "~/hooks/use-error-handler";

import { H4 } from "../ui/typography";

interface EmailVerificationDialogProps {
  open: boolean;
  onCloseAction: () => void;
  email: string;
}

export const EmailVerificationDialog = ({
  open,
  onCloseAction,
  email,
}: EmailVerificationDialogProps) => {
  const { openDialog } = useDialog();
  const { handleError } = useErrorHandler();
  const { secondsLeft, start } = useCooldown(`resend-email-${email}`);

  const disabled = secondsLeft > 0;

  const { mutateAsync: resendVerificationCode, isPending: isLoading } =
    useMutation({
      mutationFn: resendVerificationCodeMutationFunction,
    });

  const handleSubmit = async () => {
    try {
      await resendVerificationCode({
        email,
      });

      await start();
    } catch (error) {
      console.error("Error: ", error);

      const errorMessage = handleError(error);

      onCloseAction();

      openDialog({
        type: "error",
        props: {
          title: "Error",
          description: errorMessage,
          onConfirmAction: () => {},
        },
      });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="p-4 gap-8 min-w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <H4>Email Verification Is Required</H4>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <View className="flex flex-col gap-4">
              <Text>
                We have sent a verification email to{" "}
                <Text className="font-poppins-bold">{email}</Text>
              </Text>

              <Text>
                Please check your inbox and click the link to verify your
                account. If you don’t see the email in your inbox, check your{" "}
                <Text className="font-poppins-bold">spam folder</Text>.
              </Text>
            </View>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={onCloseAction} disabled={isLoading}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            onPress={() => {
              handleSubmit();
            }}
            disabled={isLoading || disabled}
          >
            {isLoading ? (
              <View className="flex flex-row items-center">
                <ActivityIndicator
                  size="small"
                  className="mr-2 color-muted-foreground"
                />
                <Text>Sending...</Text>
              </View>
            ) : disabled ? (
              <Text>You can resend in {secondsLeft}s</Text>
            ) : (
              <Text>Resend Verification Email</Text>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
