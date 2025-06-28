import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { Button } from "../ui/button";

interface DrawerButtonProps {
  isTracking: boolean;
  connectionStatus: string;
  stopTracking: () => void;
  startTracking: () => void;
}

const DrawerButton = ({
  isTracking,
  stopTracking,
  startTracking,
  connectionStatus,
}: DrawerButtonProps) => {
  return (
    <View className="flex items-center justify-center">
      <Button
        size={"icon"}
        className={`${isTracking ? "bg-red-600" : "bg-green-600"} w-16 h-16 rounded-full`}
        onPress={async () => {
          if (isTracking) {
            await stopTracking();
          } else {
            await startTracking();
          }
        }}
        disabled={connectionStatus === "connecting" ? true : false}
      >
        {isTracking ? (
          <Ionicons name="stop" size={24} color="white" />
        ) : connectionStatus === "connecting" ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name="play" size={24} color="white" />
        )}
      </Button>
    </View>
  );
};

export default DrawerButton;
