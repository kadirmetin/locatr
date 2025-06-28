import React, { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps as RNTextInputProps,
  View,
} from "react-native";

import { cn } from "~/lib/utils";

type Size = "sm" | "md" | "lg";

type InputProps = RNTextInputProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholderClassName?: string;
  size?: Size;
  containerClassName?: string;
};

const sizeStyles: Record<Size, string> = {
  sm: "web:h-9 native:h-12 h-12 text-sm font-normal leading-[1.25]",
  md: "web:h-11 native:h-14 h-14 text-base font-medium leading-[1.5]",
  lg: "web:h-12 native:h-16 h-16 text-lg font-semibold leading-[1.5]",
};

const styles = StyleSheet.create({
  textInput: {
    textAlignVertical: "center",
    includeFontPadding: false,
  },
});

export const Input = forwardRef<
  React.ComponentRef<typeof TextInput>,
  InputProps
>(
  (
    {
      className,
      placeholderClassName,
      leftIcon,
      rightIcon,
      editable = true,
      size = "md",
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <View className={cn("relative w-full", containerClassName)}>
        {leftIcon && (
          <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2 justify-center">
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={props.placeholderTextColor ?? "#9CA3AF"}
          style={styles.textInput}
          className={cn(
            "font-poppins rounded-md border border-input bg-background px-3 text-foreground",
            "android:py-3 ios:py-3",
            "web:w-full web:ring-offset-background web:file:border-0 web:file:bg-transparent web:file:font-medium",
            "web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
            sizeStyles[size],
            !editable && "opacity-50 web:cursor-not-allowed",
            placeholderClassName,
            leftIcon && "pl-11",
            rightIcon && "pr-11",
            className,
          )}
          {...props}
        />

        {rightIcon && (
          <View className="absolute right-3 top-1/2 z-10 -translate-y-1/2 justify-center">
            {rightIcon}
          </View>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";
