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

const ProfileSection = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <View className="flex-row justify-between items-center">
          <View className="flex-1 mr-4">
            <CardTitle>
              <H4>Profile</H4>
            </CardTitle>
            <CardDescription className="flex-wrap">
              <Muted>
                Manage your account preferences and personal information
              </Muted>
            </CardDescription>
          </View>
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            className="color-primary"
          />
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex gap-6">
          <SettingItem
            title="Edit on Dashboard"
            description="Update your profile via our web dashboard"
            iconName="globe-outline"
            rightIconName="open-outline"
            onPress={() => {
              Linking.openURL(
                `${process.env.EXPO_PUBLIC_WEB_APP_URL}/dashboard/settings?tab=profile`,
              );
            }}
          />
        </View>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
