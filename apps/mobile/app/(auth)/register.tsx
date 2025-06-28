import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { registerMutationFunction } from "~/api/auth.api";
import AuthForm from "~/components/auth/AuthForm";
import SocialLogin from "~/components/auth/SocialLogin";
import { H2, P, Small } from "~/components/ui/typography";
import { useDialog } from "~/context/dialog-context";
import { useErrorHandler } from "~/hooks/use-error-handler";
import { LoginFormData, RegisterFormData } from "~/lib/schemas/authSchema";

const RegisterScreen = () => {
  const router = useRouter();
  const { openDialog } = useDialog();
  const { handleError } = useErrorHandler();
  const { mutateAsync: register, isPending: isLoading } = useMutation({
    mutationFn: registerMutationFunction,
  });

  const onSubmit = async (values: LoginFormData | RegisterFormData) => {
    try {
      await register(values as RegisterFormData);

      openDialog({
        type: "success",
        props: {
          title: "Check Your Email",
          description: "We've sent a verification email to your address.",
          confirmText: "Back to Login",
          onConfirmAction: () => {
            router.replace("/login");
          },
        },
      });
    } catch (error) {
      console.error("Error: ", error);

      const errorMessage = handleError(error);

      openDialog({
        type: "error",
        props: {
          title: "Error",
          description: errorMessage,
          onConfirmAction: () => {},
        },
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      openDialog({
        type: "confirmation",
        props: {
          title: "Google Login Coming Soon",
          description: (
            <View className="flex flex-col gap-4">
              <P className="text-base text-muted-foreground">
                We&apos;re still working on integrating Google login. For now,
                please sign in using your email and password.
              </P>
            </View>
          ),
          cancelText: "Okay, thanks!",
        },
      });
    } catch (error) {
      console.error(error);

      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          className="px-3"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            <View className="flex pt-10 pb-10 gap-2">
              <H2>Create an Account</H2>
              <P>Enter your email to get started and create your account.</P>
            </View>

            <AuthForm
              formType="register"
              isLoading={isLoading}
              onSubmit={onSubmit}
            />

            <View className="flex flex-row justify-center items-center my-4">
              <View className="flex-1 h-px bg-foreground" />
              <Text className="mx-4 text-foreground text-sm font-poppins">
                Or continue with
              </Text>
              <View className="flex-1 h-px bg-foreground" />
            </View>

            <SocialLogin
              isLoading={false}
              handleGoogleLogin={handleGoogleLogin}
            />

            <View className="pt-8">
              <Pressable
                onPress={() => {
                  router.back();
                }}
              >
                <Small className="text-center underline">
                  Already have an account? Login
                </Small>
              </Pressable>
            </View>
          </View>

          <View className="flex flex-row pt-10 justify-center items-center">
            <P className="text-xs">
              By continuing, you agree to our{" "}
              <Link
                href={`${process.env.EXPO_PUBLIC_WEB_APP_URL}/terms`}
                className="underline"
              >
                Terms
              </Link>{" "}
              &{" "}
              <Link
                href={`${process.env.EXPO_PUBLIC_WEB_APP_URL}/privacy`}
                className="underline"
              >
                Privacy Policy
              </Link>
            </P>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
