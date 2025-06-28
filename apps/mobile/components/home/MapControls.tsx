import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";

import { Button } from "../ui/button";

interface MapControlsProps {
  onRecenter: () => void;
  onCompass: () => void;
}

const MapControls = ({ onRecenter, onCompass }: MapControlsProps) => (
  <View className="absolute top-4 right-5 gap-3 z-10">
    <Button
      className="flex items-center justify-center w-12 h-12 bg-background"
      size="icon"
      onPress={onRecenter}
    >
      <Ionicons name="locate-outline" size={24} className="color-primary" />
    </Button>
    <Button
      className="flex items-center justify-center w-12 h-12 bg-background"
      size="icon"
      onPress={onCompass}
    >
      <Ionicons name="compass-outline" size={24} className="color-primary" />
    </Button>
  </View>
);

export default MapControls;
