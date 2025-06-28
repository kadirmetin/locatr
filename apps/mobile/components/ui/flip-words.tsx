import { AnimatePresence, MotiText, MotiView } from "moti";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
  textClassName?: string;
}

export const FlipWords = ({
  words,
  duration = 3000,
  className = "",
  textClassName = "",
}: FlipWordsProps) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    const wordIndex = words.indexOf(currentWord);
    const nextIndex = (wordIndex + 1) % words.length;
    setCurrentWord(words[nextIndex]);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  const onAnimationComplete = () => {
    setIsAnimating(false);
  };

  return (
    <View className={`${className} min-h-8`}>
      <AnimatePresence onExitComplete={onAnimationComplete}>
        <MotiView
          key={currentWord}
          from={{
            opacity: 0,
            translateY: 5,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          exit={{
            opacity: 0,
            translateY: -5,
            position: "absolute",
          }}
          transition={{
            type: "timing",
            duration: 300,
          }}
          className="absolute self-center"
        >
          <MotiText className={textClassName}>{currentWord}</MotiText>
        </MotiView>
      </AnimatePresence>
    </View>
  );
};
