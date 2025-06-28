import React from "react";
import { ActivityIndicator, View } from "react-native";

import { Text } from "../ui/text";

const MapLoading = () => {
  return (
    <View className="h-1/4 w-2/3 bg-secondary rounded-lg justify-center items-center z-10 gap-4">
      <ActivityIndicator size="large" className="color-muted-foreground" />
      <Text className="text-foreground">Loading...</Text>
    </View>
  );
};

export default MapLoading;
