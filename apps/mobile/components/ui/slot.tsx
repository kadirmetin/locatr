import { type SlotProps } from "input-otp-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <View
      className={cn(
        "w-[50px] h-[50px] items-center justify-center border border-border rounded-lg bg-secondary",
        {
          "border-primary border-2": isActive,
        },
      )}
    >
      {char !== null && <Text className="text-foreground">{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeCaret() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="absolute w-full h-full items-center justify-center">
      <Animated.View
        className={`w-[2px] h-7 bg-primary rounded-sm`}
        style={animatedStyle}
      />
    </View>
  );
}
