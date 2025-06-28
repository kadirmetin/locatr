import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { loginMutationFunction } from "~/api/auth.api";
import AuthForm from "~/components/auth/AuthForm";
import SocialLogin from "~/components/auth/SocialLogin";
import { H2, P, Small } from "~/components/ui/typography";
import { useAuthContext } from "~/context/auth-context";
import { useDialog } from "~/context/dialog-context";
import { useErrorHandler } from "~/hooks/use-error-handler";
import { getPersistentDeviceId } from "~/lib/getDeviceInfo";
import { LoginFormData, RegisterFormData } from "~/lib/schemas/authSchema";
import { useAppStore } from "~/stores/app-store";

const LoginScreen = () => {
  const router = useRouter();
  const { openDialog } = useDialog();
  const { handleError } = useErrorHandler();
  const { refetch } = useAuthContext();
  const { setLoading } = useAppStore();
  const { mutateAsync: login, isPending: isLoading } = useMutation({
    mutationFn: loginMutationFunction,
  });

  const onSubmit = async (values: LoginFormData | RegisterFormData) => {
    try {
      const deviceId = await getPersistentDeviceId();
      const { data } = await login({
        email: values.email,
        password: (values as LoginFormData).password,
        deviceId: deviceId,
      });

      const { isEmailVerified, mfaRequired } = data;

      if (!isEmailVerified) {
        openDialog({
          type: "emailVerification",
          props: { email: values.email },
        });
        return;
      }

      if (mfaRequired) {
        openDialog({
          type: "loginMfa",
          props: { email: values.email },
        });
        return;
      }

      setLoading(true);
      refetch();

      router.replace("/home");
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
              <H2>Login to Locatr</H2>
              <P className="font-poppins">Your World, Mapped</P>
            </View>

            <AuthForm
              formType="login"
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
              <Link href="/register">
                <Small className="text-center underline">
                  Don&#39;t have an account? Register
                </Small>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
