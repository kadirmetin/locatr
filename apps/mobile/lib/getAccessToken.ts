import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppStore } from "~/stores/app-store";

const setAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("accessToken", token);
    useAppStore.getState().setAccessToken(token);
  } catch (e) {
    console.error("Failed to save token", e);
  }
};

const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("accessToken");
  } catch (e) {
    console.error("Failed to get token", e);
    return null;
  }
};

export { getAccessToken, setAccessToken };
