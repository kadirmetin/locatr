import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Easing } from "react-native-reanimated";

import Logo from "~/assets/logo.svg";
import LogoDark from "~/assets/logo-black.svg";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { useAppStore } from "~/stores/app-store";

const LoadingScreen = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { isApiCallComplete, setApiCallComplete, setLoading } = useAppStore();
  const [startExit, setStartExit] = useState(false);
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 380;

  const LogoComponent = isDarkColorScheme ? Logo : LogoDark;

  useEffect(() => {
    const runExitSequence = async () => {
      // Wait for start animation to complete
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Start exit animation if api call complete
      if (isApiCallComplete) {
        setStartExit(true);

        await new Promise((resolve) => setTimeout(resolve, 600));

        setLoading(false);
        setApiCallComplete(false);
      }
    };

    runExitSequence();
  }, [isApiCallComplete, setApiCallComplete, setLoading]);

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.8,
        translateY: -20,
      }}
      animate={{
        opacity: startExit ? 0 : 1,
        scale: startExit ? 1.2 : 1,
        translateY: startExit ? -10 : 0,
      }}
      transition={{
        type: "timing",
        duration: startExit ? 600 : 800,
        easing: startExit ? Easing.out(Easing.ease) : Easing.elastic(1.2),
      }}
      className="h-full w-full items-center justify-center bg-background z-50"
    >
      <MotiView
        from={{ rotate: "0deg" }}
        animate={{ rotate: "360deg" }}
        transition={{
          type: "timing",
          duration: startExit ? 600 : 1500,
          loop: !startExit,
          repeatReverse: false,
          easing: startExit ? Easing.out(Easing.ease) : undefined,
        }}
        className="absolute"
      >
        <View className="h-40 w-40 items-center justify-center">
          <View
            className={`absolute top-1 h-2 w-2 rounded-full ${
              isDarkColorScheme ? "bg-white" : "bg-black"
            }`}
          />
        </View>
      </MotiView>

      <View
        className={`${isSmallDevice ? "w-24 h-24" : "w-32 h-32"} items-center justify-center`}
      >
        <LogoComponent width={"100%"} height={"100%"} />
      </View>
    </MotiView>
  );
};

export default LoadingScreen;
