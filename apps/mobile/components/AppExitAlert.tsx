import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";

import { useDialog } from "~/context/dialog-context";

interface AppExitAlertProps {
  onExit: () => void;
}

const AppExitAlert = ({ onExit }: AppExitAlertProps) => {
  const { openDialog } = useDialog();

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        openDialog({
          type: "confirmation",
          props: {
            title: "Exit App",
            description: "Are you sure you want to exit the app?",
            onConfirmAction: () => {
              onExit();
            },
            confirmText: "Yes",
            cancelText: "No",
          },
        });

        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => {
        backHandler.remove();
      };
    }, [onExit, openDialog]),
  );

  return null;
};

export default AppExitAlert;
