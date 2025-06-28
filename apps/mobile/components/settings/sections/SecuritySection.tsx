import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Linking, View } from "react-native";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { H4, Muted } from "../../ui/typography";
import SettingItem from "../SettingsItem";

const SecuritySection = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <View className="flex-row justify-between items-center">
          <View className="flex-1 mr-4">
            <CardTitle>
              <H4>Security</H4>
            </CardTitle>
            <CardDescription className="flex-wrap">
              <Muted>
                Manage your security settings to protect your account
              </Muted>
            </CardDescription>
          </View>
          <MaterialCommunityIcons
            name="security"
            size={24}
            className="color-primary"
          />
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex gap-6">
          <SettingItem
            title="Edit on Dashboard"
            description="Manage your security preferences via our web dashboard"
            iconName="globe-outline"
            rightIconName="open-outline"
            onPress={() => {
              Linking.openURL(
                `${process.env.EXPO_PUBLIC_WEB_APP_URL}/dashboard/settings?tab=security`,
              );
            }}
          />
        </View>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
