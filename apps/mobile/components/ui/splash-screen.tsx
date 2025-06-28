import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Easing } from "react-native-reanimated";

import LogoDark from "~/assets/logo-black.svg";
import Logo from "~/assets/logo.svg";
import { useAuthContext } from "~/context/auth-context";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { getAccessToken } from "~/lib/getAccessToken";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/stores/app-store";

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();
  const { isDarkColorScheme } = useColorScheme();
  const { setAnimationComplete, isAnimationComplete, setAccessToken } =
    useAppStore();
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 380;
  const [startExit, setStartExit] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const LogoComponent = isDarkColorScheme ? Logo : LogoDark;

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Wait for start animation to complete
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Get access token and set it in the store
        const token = await getAccessToken();
        setAccessToken(token);

        // Start exit animation if not loading
        if (!isLoading) {
          setStartExit(true);
          setIsBouncing(false);
          await new Promise((resolve) => setTimeout(resolve, 600));
          setAnimationComplete(true);
        } else {
          // Keep bouncing if still loading
          setIsBouncing(true);
        }
      } catch (e) {
        console.error("Failed to prepare app", e);
        setAnimationComplete(true);
      }
    };

    prepareApp();
  }, [isLoading, setAnimationComplete, setAccessToken]);

  useEffect(() => {
    if (isAnimationComplete) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/welcome");
      }
    }
  }, [user, router, isAnimationComplete]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <MotiView
        from={{
          opacity: 0,
          scale: 0.2,
          translateY: -20,
        }}
        animate={{
          opacity: startExit ? 0 : 1,
          scale: startExit ? 1.2 : 1,
          translateY: startExit ? -50 : isBouncing ? [0, -20] : 0,
        }}
        transition={{
          type: "timing",
          duration: startExit ? 600 : isBouncing ? 400 : 800,
          easing: startExit
            ? Easing.out(Easing.ease)
            : isBouncing
              ? Easing.inOut(Easing.ease)
              : Easing.elastic(1.2),
          loop: startExit ? undefined : isBouncing ? true : undefined,
          repeatReverse: startExit ? undefined : isBouncing ? true : undefined,
        }}
        onDidAnimate={(_, didAnimationFinish) => {
          if (!startExit && !isBouncing && didAnimationFinish) {
            setIsBouncing(true);
          }
        }}
        className={cn(
          "items-center justify-center",
          isSmallDevice ? "w-24 h-24" : "w-32 h-32",
        )}
      >
        <View
          className={`${isSmallDevice ? "w-24 h-24" : "w-32 h-32"} items-center justify-center`}
        >
          <LogoComponent width={"100%"} height={"100%"} />
        </View>
      </MotiView>
    </View>
  );
}
