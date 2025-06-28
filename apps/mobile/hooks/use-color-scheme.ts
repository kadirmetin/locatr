import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useCallback, useEffect, useMemo } from "react";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const savedColorScheme = await AsyncStorage.getItem("color-scheme");
        if (savedColorScheme) {
          setColorScheme(savedColorScheme as "light" | "dark");
        }
      } catch (error) {
        console.error("Error loading theme: ", error);
      }
    };

    loadColorScheme();
  }, [setColorScheme]);

  const persistColorScheme = async (newColorScheme: "light" | "dark") => {
    try {
      await AsyncStorage.setItem("color-scheme", newColorScheme);
    } catch (error) {
      console.error("Error saving a theme: ", error);
    }
  };

  const customToggleColorScheme = useCallback(() => {
    const newColorScheme = colorScheme === "dark" ? "light" : "dark";
    persistColorScheme(newColorScheme);
    toggleColorScheme();
  }, [colorScheme, toggleColorScheme]);

  return useMemo(
    () => ({
      colorScheme: colorScheme ?? "dark",
      isDarkColorScheme: colorScheme === "dark",
      setColorScheme,
      toggleColorScheme: customToggleColorScheme,
    }),
    [colorScheme, setColorScheme, customToggleColorScheme],
  );
}
