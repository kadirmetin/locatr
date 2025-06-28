import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;

export const useCooldown = (
  storageKey: string,
  durationMs: number = 180_000, // 3 min
) => {
  const [remaining, setRemaining] = useState<number>(0);
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(storageKey);
      const endAt = stored ? Number(stored) : 0;
      if (endAt && endAt > Date.now()) {
        endAtRef.current = endAt;
        setRemaining(endAt - Date.now());
      }
    })();
  }, [storageKey]);

  useEffect(() => {
    if (!endAtRef.current) return;
    const id = setInterval(() => {
      const diff = (endAtRef.current ?? 0) - Date.now();
      if (diff <= 0) {
        clearInterval(id);
        endAtRef.current = null;
        AsyncStorage.removeItem(storageKey);
        setRemaining(0);
      } else {
        setRemaining(diff);
      }
    }, SECOND);
    return () => clearInterval(id);
  }, [storageKey, remaining]);

  const start = async () => {
    const endAt = Date.now() + durationMs;
    endAtRef.current = endAt;
    await AsyncStorage.setItem(storageKey, String(endAt));
    setRemaining(durationMs);
  };

  return {
    secondsLeft: Math.ceil(remaining / SECOND),
    start,
  };
};
