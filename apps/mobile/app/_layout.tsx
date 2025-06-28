import "./global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import * as React from "react";
import { Platform } from "react-native";

import { useColorScheme } from "~/hooks/use-color-scheme";
import { NAV_THEME } from "~/lib/constants";
import { applyIconInterop } from "~/lib/iconInterop";

import Providers from "./providers";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [loaded, error] = useFonts({
    Poppins: require("~/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("~/assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("~/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Light": require("~/assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("~/assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Medium": require("~/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Italic": require("~/assets/fonts/Poppins/Poppins-Italic.ttf"),
  });

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }

    SystemUI.setBackgroundColorAsync(
      isDarkColorScheme
        ? NAV_THEME.dark.background
        : NAV_THEME.light.background,
    );

    setIsColorSchemeLoaded(true);

    applyIconInterop();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Providers>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        <PortalHost />
      </Providers>
    </ThemeProvider>
  );
}
