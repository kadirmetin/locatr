import axios from "axios";
import { router } from "expo-router";

import { useAppStore } from "~/stores/app-store";

import { setAccessToken } from "./getAccessToken";

const options = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "X-Client-App": "mobile",
  },
};

const API = axios.create(options);
export const APIRefresh = axios.create(options);

APIRefresh.interceptors.response.use(
  async (response) => {
    const token = response.data.data?.accessToken;

    if (token) {
      await setAccessToken(token);
    }
    return response;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (!error.response) {
      error.message =
        "Network error or server timeout. Please check your internet connection.";
      return Promise.reject(error);
    }

    const { data, status, config } = error.response;

    if (data?.errorCode === "AUTH_TOKEN_NOT_FOUND" && status === 401) {
      try {
        await APIRefresh.get("/auth/refresh");

        return API(config);
      } catch (error) {
        const { isAnimationComplete } = useAppStore.getState();

        if (isAnimationComplete) {
          router.replace("/welcome");
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
