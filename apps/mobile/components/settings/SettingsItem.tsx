import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Separator } from "../ui/separator";
import { P, Small } from "../ui/typography";

interface SettingItemProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgColor?: string;
  iconColor?: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  customClasses?: string;
  separator?: boolean;
}

const SettingItem = ({
  title,
  description,
  iconName,
  iconColor = "color-primary",
  rightIconName = "chevron-forward",
  onPress,
  customClasses = "",
  separator = false,
}: SettingItemProps) => {
  return (
    <>
      <TouchableOpacity
        className={`w-full ${customClasses}`}
        activeOpacity={0.75}
        onPress={onPress}
      >
        <View className="flex flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center gap-3">
            <Ionicons name={iconName} size={24} className={iconColor} />
            <View className="flex flex-col justify-between flex-1 mr-4">
              <P className="font-poppins-medium">{title}</P>
              <Small className="text-muted-foreground font-poppins flex-wrap">
                {description}
              </Small>
            </View>
          </View>
          <View className="flex-shrink-0">
            <Ionicons
              name={rightIconName}
              size={20}
              className="color-foreground"
            />
          </View>
        </View>
      </TouchableOpacity>

      {separator && <Separator />}
    </>
  );
};

export default SettingItem;
