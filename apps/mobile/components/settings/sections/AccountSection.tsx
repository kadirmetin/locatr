import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, View } from "react-native";

import { logoutMutationFunction } from "~/api/auth.api";
import { deleteDeviceMutationFunction } from "~/api/device.api";
import { useAuthContext } from "~/context/auth-context";
import { useDialog } from "~/context/dialog-context";
import { useDevice } from "~/hooks/use-device";
import { useErrorHandler } from "~/hooks/use-error-handler";
import {
  deleteDeviceInfo,
  deletePersistentDeviceId,
} from "~/lib/getDeviceInfo";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { H4, Muted } from "../../ui/typography";
import SettingItem from "../SettingsItem";

const AccountSection = () => {
  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutMutationFunction,
  });
  const { mutateAsync: deleteDevice } = useMutation({
    mutationFn: deleteDeviceMutationFunction,
  });
  const { deviceId } = useDevice();

  const { refetch } = useAuthContext();
  const { handleError } = useErrorHandler();
  const router = useRouter();
  const { openDialog } = useDialog();

  const handleLogout = () => {
    openDialog({
      type: "confirmation",
      props: {
        title: "Log out?",
        description: "Are you sure you want to end your session?",
        confirmText: "Log out",
        loadingText: "Logging out…",
        onConfirmAction: async () => {
          try {
            await logout();

            await deleteDeviceInfo();

            await refetch();

            router.replace("/welcome");
          } catch (error) {
            const errorMessage = handleError(error);
            openDialog({
              type: "error",
              props: {
                title: "Error",
                description: errorMessage,
              },
            });
          }
        },
      },
    });
  };

  const handleDeleteDevice = () => {
    openDialog({
      type: "confirmation",
      props: {
        title: "Delete Device?",
        description:
          "Are you sure you want to permanently delete this device? This action cannot be undone.",
        confirmText: "Delete Device",
        loadingText: "Deleting…",
        isDestructive: true,
        onConfirmAction: async () => {
          try {
            await deleteDevice(deviceId as string);

            await deleteDeviceInfo();
            await deletePersistentDeviceId();

            await logout();

            await refetch();

            await AsyncStorage.clear();

            router.replace("/welcome");
          } catch (error) {
            const errorMessage = handleError(error);
            openDialog({
              type: "error",
              props: {
                title: "Error",
                description: errorMessage,
              },
            });
          }
        },
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <View className="flex-row justify-between items-center">
          <View>
            <CardTitle>
              <H4>Account</H4>
            </CardTitle>
            <CardDescription className="flex-wrap">
              <Muted>Manage your account settings.</Muted>
            </CardDescription>
          </View>
          <MaterialCommunityIcons
            name="account-cog-outline"
            size={24}
            className="color-primary"
          />
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex gap-6">
          <SettingItem
            title="Logout"
            description="Securely logout from your current session"
            iconName="log-out-outline"
            onPress={handleLogout}
          />

          <SettingItem
            title="Remove Device"
            description="Permanently delete this device from your account"
            iconName="trash-outline"
            iconColor="color-destructive"
            separator
            onPress={handleDeleteDevice}
          />

          <SettingItem
            title="Advanced Settings"
            description="Manage additional preferences on web dashboard"
            iconName="globe-outline"
            rightIconName="open-outline"
            onPress={() => {
              Linking.openURL(
                `${process.env.EXPO_PUBLIC_WEB_APP_URL}/dashboard/settings?tab=account`,
              );
            }}
          />
        </View>
      </CardContent>
    </Card>
  );
};

export default AccountSection;
