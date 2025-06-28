import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import { BackHandler, Linking, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoDark from "~/assets/logo-black.svg";
import Logo from "~/assets/logo.svg";
import AppExitAlert from "~/components/AppExitAlert";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { FlipWords } from "~/components/ui/flip-words";
import { Text } from "~/components/ui/text";
import { H1, H3, P } from "~/components/ui/typography";
import { useDialog } from "~/context/dialog-context";
import { useColorScheme } from "~/hooks/use-color-scheme";

const words = ["securely", "privately", "reliably"];

const WelcomeScreen = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { openDialog } = useDialog();
  const router = useRouter();

  const handleExit = React.useCallback(() => {
    BackHandler.exitApp();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="grow">
        <View className="flex-1 justify-between items-center py-8">
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800 }}
            className="w-full items-center"
          >
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center">
              {isDarkColorScheme ? (
                <LogoDark width={40} height={40} />
              ) : (
                <Logo width={40} height={40} />
              )}
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 800, delay: 300 }}
            className="flex items-center px-6"
          >
            <H1 className="text-center mb-2">Welcome to Locatr</H1>
            <View className="mb-8 items-center">
              <H3 className="text-center">Stay connected with your family,</H3>
              <FlipWords
                words={words}
                textClassName="text-2xl text-center text-foreground font-poppins-semibold tracking-tight leading-tight"
              />
            </View>

            <Card className="w-full max-w-sm p-6">
              <P className="text-center mb-2">
                Locatr helps you keep track of your devices and loved ones with
                real-time location services.
              </P>

              <P className="mb-6">Get started by selecting an option below.</P>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 600, delay: 600 }}
                className="gap-2"
              >
                <Button
                  className="flex flex-row items-center justify-center gap-2"
                  onPress={() => router.navigate("/login")}
                >
                  <Ionicons
                    name="location"
                    size={20}
                    className="color-secondary"
                  />
                  <Text>Track This Device</Text>
                </Button>

                <Button
                  className="flex flex-row items-center justify-center gap-2"
                  onPress={() =>
                    openDialog({
                      type: "confirmation",
                      props: {
                        title: '"Manage My Account" Coming Soon',
                        description: (
                          <View className="flex flex-col gap-4">
                            <P className="text-base text-muted-foreground">
                              Manage My Account is not yet implemented. This
                              feature will be available soon!
                            </P>
                            <P className="text-base text-muted-foreground">
                              You can access this feature on our website.
                            </P>
                          </View>
                        ),
                        confirmText: "Go to website",
                        onConfirmAction: () => {
                          Linking.openURL(
                            process.env.EXPO_PUBLIC_WEB_APP_URL as string,
                          );
                        },
                      },
                    })
                  }
                >
                  <Ionicons
                    name="person"
                    size={20}
                    className="color-secondary"
                  />
                  <Text>Manage My Account</Text>
                </Button>
              </MotiView>
            </Card>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 800, delay: 1000 }}
            className="flex-row justify-center items-center"
          >
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
          </MotiView>
        </View>
      </ScrollView>
      <AppExitAlert onExit={handleExit} />
    </SafeAreaView>
  );
};

export default WelcomeScreen;
