import { useCallback, useEffect, useRef, useState } from 'react';

export const useCountdown = (initialTime: number, storageKey: string) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedEndTime = localStorage.getItem(storageKey);
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const currentTime = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((endTime - currentTime) / 1000));

      if (remainingSeconds > 0) {
        setTimeLeft(remainingSeconds);
        setIsActive(true);
      } else {
        localStorage.removeItem(storageKey);
        setTimeLeft(0);
        setIsActive(false);
      }
    }
  }, [storageKey]);

  const start = useCallback(() => {
    const endTime = Date.now() + initialTime * 1000;
    localStorage.setItem(storageKey, endTime.toString());
    setTimeLeft(initialTime);
    setIsActive(true);
  }, [initialTime, storageKey]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft === 0 && isActive) {
        localStorage.removeItem(storageKey);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, storageKey]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      localStorage.removeItem(storageKey);
    }
  }, [timeLeft, isActive, storageKey]);

  return {
    timeLeft,
    isActive,
    formattedTime: formatTime(timeLeft),
    start,
    stop,
  };
};
