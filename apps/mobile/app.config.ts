import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Locatr",
  description: "",
  owner: "kadirmetin",
  slug: "locatr",
  version: "1.0.0",
  scheme: "com.kadirmetin.locatr",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "./assets/icon.png",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.kadirmetin.locatr",
    icon: {
      light: "./assets/ios-light.png",
      dark: "./assets/ios-dark.png",
      tinted: "./assets/ios-tinted.png",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.kadirmetin.locatr",
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: "pan",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-secure-store",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_READ_DOWNLOAD_TOKEN,
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash-icon-dark.png",
        dark: {
          image: "./assets/splash-icon-light.png",
          backgroundColor: "#000000",
        },
        imageWidth: 200,
      },
    ],
  ],
  assetBundlePatterns: ["**/*"],
  extra: {
    eas: {
      projectId: "c2545f75-6e0d-425e-aaa9-744ee416f0a2",
    },
  },
});
