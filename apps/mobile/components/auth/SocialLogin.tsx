import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

import { Button } from "../ui/button";
import { Text } from "../ui/text";

interface SocialLoginProps {
  isLoading: boolean;
  handleGoogleLogin: () => void;
}

const SocialLogin = ({ isLoading, handleGoogleLogin }: SocialLoginProps) => {
  return (
    <Button variant="default" disabled={isLoading} onPress={handleGoogleLogin}>
      <View className="flex flex-row items-center justify-center">
        <Ionicons
          name="logo-google"
          size={20}
          className="color-secondary mr-2"
        />

        <Text>Google</Text>
      </View>
    </Button>
  );
};

export default SocialLogin;
