import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { updateDeviceNotificationPreferencesMutationFunction } from "~/api/device.api";
import { useDialog } from "~/context/dialog-context";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { useDevice } from "~/hooks/use-device";
import { useErrorHandler } from "~/hooks/use-error-handler";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Switch } from "../../ui/switch";
import { H4, Muted, P, Small } from "../../ui/typography";
import SettingItem from "../SettingsItem";

const AppSettingsSection = () => {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const {
    mutateAsync: updateDeviceNotificationPreferences,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: updateDeviceNotificationPreferencesMutationFunction,
  });
  const { data: deviceInfo, deviceId, isLoading, refetch } = useDevice();
  const { handleError } = useErrorHandler();
  const { openDialog } = useDialog();

  const handleCheck = async () => {
    try {
      await updateDeviceNotificationPreferences(deviceId as string);

      refetch();
    } catch (error) {
      console.error("Error: ", error);

      const errorMessage = handleError(error);

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
    <Card className="w-full">
      <CardHeader>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <CardTitle>
              <H4>App</H4>
            </CardTitle>
            <CardDescription className="flex-wrap">
              <Muted>
                Customize your Locatr experience to suit your preferences
              </Muted>
            </CardDescription>
          </View>
          <MaterialCommunityIcons
            name="application-cog-outline"
            size={24}
            className="color-primary"
          />
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex gap-4">
          <SettingItem
            title="Edit Device Info"
            description="Manage your device name and icon"
            iconName="pencil-outline"
            onPress={() => router.navigate("/edit-device-info")}
          />

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <P className="font-poppins-medium">Push Notifications</P>
              <Small className="text-muted-foreground font-poppins">
                Stay informed with timely updates and important alerts.
              </Small>
            </View>
            <Switch
              disabled={isLoading || isUpdating}
              checked={deviceInfo?.devicePreferences?.pushNotification ?? false}
              onCheckedChange={handleCheck}
              nativeID="notifications-switch"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <P className="font-poppins-medium">Theme</P>
              <Small className="text-muted-foreground font-poppins">
                Adjust interface theme for visual comfort
              </Small>
            </View>
            <Switch
              checked={colorScheme === "dark"}
              onCheckedChange={toggleColorScheme}
              nativeID="theme-switch"
            />
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default AppSettingsSection;
