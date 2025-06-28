import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";

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

interface ConfirmationDialogProps {
  open: boolean;
  onCloseAction: () => void;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirmAction?: () => Promise<void> | void;
  loadingText?: string;
}

export const ConfirmationDialog = ({
  open,
  onCloseAction,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirmAction,
  loadingText = "Please wait…",
}: ConfirmationDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirmAction) return;
    setLoading(true);
    await onConfirmAction();
    setLoading(false);
    onCloseAction();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-[90%] p-4 space-y-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onPress={onCloseAction}>
            <Text>{cancelText}</Text>
          </AlertDialogCancel>

          {onConfirmAction && (
            <AlertDialogAction
              onPress={handleConfirm}
              disabled={loading}
              className={isDestructive ? "bg-destructive" : undefined}
            >
              {loading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator
                    size="small"
                    className="mr-2 color-muted-foreground"
                  />
                  <Text>{loadingText}</Text>
                </View>
              ) : (
                <Text>{confirmText}</Text>
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
