import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import { DialogRenderer } from "~/components/dialogs/DialogRenderer";
import { AuthProvider } from "~/context/auth-context";
import { DialogProvider } from "~/context/dialog-context";
import { useAppStore } from "~/stores/app-store";

import LoadingScreen from "./loading";

const isAxios401 = (e: unknown) =>
  isAxiosError(e) && e.response?.status === 401;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, err) => (isAxios401(err) ? false : count < 2),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      placeholderData: (previous: unknown) => previous,
    },
  },
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={styles.gestureHandler}>
          <DialogProvider>
            <DialogRenderer />
            {children}
            {isLoading && <LoadingScreen />}
          </DialogProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  gestureHandler: { flex: 1 },
});
