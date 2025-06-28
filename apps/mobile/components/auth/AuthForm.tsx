import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Linking, View } from "react-native";

import {
  LoginFormData,
  loginSchema,
  RegisterFormData,
  registerSchema,
} from "~/lib/schemas/authSchema";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { P, Small } from "../ui/typography";

interface AuthFormProps {
  formType: "login" | "register";
  onSubmit: (data: LoginFormData | RegisterFormData) => void;
  isLoading: boolean;
}

const AuthForm = ({ formType, onSubmit, isLoading }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const schema = formType === "login" ? loginSchema : registerSchema;

  const { control, handleSubmit, setFocus } = useForm<
    LoginFormData | RegisterFormData
  >({
    resolver: zodResolver(schema),
    defaultValues:
      formType === "login"
        ? { email: "", password: "" }
        : { firstName: "", lastName: "", email: "", password: "" },
  });

  return (
    <View className="space-y-4 gap-4 w-full">
      {formType === "register" && (
        <>
          <Controller
            control={control}
            name="firstName"
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState,
            }) => (
              <View className="gap-2">
                <Label nativeID="firstName">
                  <P className="font-poppins-medium">First Name</P>
                </Label>
                <Input
                  ref={ref}
                  aria-labelledby="firstName"
                  placeholder="John"
                  size="lg"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`${fieldState.error ? "border-2 border-red-500" : ""}`}
                  editable={!isLoading}
                  selectTextOnFocus={!isLoading}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() =>
                    requestAnimationFrame(() => setFocus("lastName"))
                  }
                  leftIcon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      className="color-foreground"
                    />
                  }
                />

                {fieldState.error && (
                  <P className="text-red-500">{fieldState.error.message}</P>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState,
            }) => (
              <View className="gap-2">
                <Label nativeID="lastName">
                  <P className="font-poppins-medium">Last Name</P>
                </Label>
                <Input
                  ref={ref}
                  aria-labelledby="lastName"
                  placeholder="Doe"
                  value={value}
                  size="lg"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`${fieldState.error ? "border-2 border-red-500" : ""}`}
                  editable={!isLoading}
                  selectTextOnFocus={!isLoading}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() =>
                    requestAnimationFrame(() => setFocus("email"))
                  }
                  leftIcon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      className="color-foreground"
                    />
                  }
                />

                {fieldState.error && (
                  <P className="text-red-500">{fieldState.error.message}</P>
                )}
              </View>
            )}
          />
        </>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
          <View className="gap-2">
            <Label nativeID="email">
              <P className="font-poppins-medium">Email</P>
            </Label>
            <Input
              ref={ref}
              placeholder="example@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              aria-labelledby="email"
              autoCapitalize="none"
              size="lg"
              selectTextOnFocus={!isLoading}
              editable={!isLoading}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className={`${fieldState.error ? "border-2 border-red-500" : ""}`}
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() =>
                requestAnimationFrame(() => setFocus("password"))
              }
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  className="color-foreground stroke-1"
                />
              }
            />
            {fieldState.error && (
              <P className="text-red-500">{fieldState.error.message}</P>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
          <View className="gap-2">
            <Label nativeID="password">
              <P className="font-poppins-medium">Password</P>
            </Label>
            <Input
              ref={ref}
              aria-labelledby="password"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              editable={!isLoading}
              keyboardType="default"
              textContentType="password"
              autoCapitalize="none"
              size="lg"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className={`${fieldState.error ? "border-2 border-red-500" : ""}`}
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
              onSubmitEditing={handleSubmit(onSubmit)}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  className="color-foreground"
                />
              }
              rightIcon={
                <Button
                  variant={"ghost"}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    className="color-foreground"
                  />
                </Button>
              }
            />
            {fieldState.error && (
              <P className="text-red-500">{fieldState.error.message}</P>
            )}
          </View>
        )}
      />

      {formType === "login" && (
        <Button
          variant={"link"}
          onPress={() => {
            Linking.openURL(
              `${process.env.EXPO_PUBLIC_WEB_APP_URL}/auth/forgot-password`,
            );
          }}
          className="self-end"
        >
          <Small className="underline">Forgot Password?</Small>
        </Button>
      )}

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="py-4"
      >
        <P className="text-secondary">
          {formType === "login" ? (
            isLoading ? (
              <View className="flex flex-row items-center">
                <ActivityIndicator
                  size="small"
                  className="mr-2 color-muted-foreground"
                />
                <Text>Login</Text>
              </View>
            ) : (
              <Text>Login</Text>
            )
          ) : isLoading ? (
            <View className="flex flex-row items-center">
              <ActivityIndicator
                size="small"
                className="mr-2 color-muted-foreground"
              />
              <Text>Register</Text>
            </View>
          ) : (
            <Text>Register</Text>
          )}
        </P>
      </Button>
    </View>
  );
};

export default AuthForm;
