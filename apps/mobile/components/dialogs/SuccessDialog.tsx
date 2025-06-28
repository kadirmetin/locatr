import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Text } from "~/components/ui/text";

import { H4 } from "../ui/typography";

interface SuccessDialogProps {
  open: boolean;
  onCloseAction: () => void;
  title: string;
  description?: React.ReactNode;
  confirmText: string;
  onConfirmAction?: () => Promise<void> | void;
}

export const SuccessDialog = ({
  open,
  onCloseAction,
  title,
  description,
  confirmText,
  onConfirmAction,
}: SuccessDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="p-4 gap-8 w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <View className="flex flex-row gap-2">
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                className="color-green-500"
              />
              <H4>{title}</H4>
            </View>
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onConfirmAction && (
            <AlertDialogAction
              onPress={async () => {
                await onConfirmAction();
                onCloseAction();
              }}
            >
              <Text>{confirmText}</Text>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
