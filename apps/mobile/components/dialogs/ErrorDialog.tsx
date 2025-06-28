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

interface ErrorDialogProps {
  open: boolean;
  onCloseAction: () => void;
  title: string;
  description?: React.ReactNode;
  onConfirmAction?: () => Promise<void> | void;
}

export const ErrorDialog = ({
  open,
  onCloseAction,
  title,
  description,
  onConfirmAction,
}: ErrorDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="p-4 gap-8 w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <View className="flex flex-row gap-2">
              <Ionicons
                name="alert-circle-outline"
                size={24}
                className="color-red-500"
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
              <Text>OK</Text>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
