import * as Application from "expo-application";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountSection from "~/components/settings/sections/AccountSection";
import AppSettingsSection from "~/components/settings/sections/AppSettingsSection";
import ProfileSection from "~/components/settings/sections/ProfileSection";
import SecuritySection from "~/components/settings/sections/SecuritySection";
import UserInfoSection from "~/components/settings/sections/UserInfoSection";
import { H2, Muted } from "~/components/ui/typography";
import { useAuthContext } from "~/context/auth-context";

const SettingsScreen = () => {
  const { user } = useAuthContext();
  const [version, setVersion] = useState<string | null>("");

  useEffect(() => {
    const appVersion = Application.nativeApplicationVersion;
    setVersion(appVersion);
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <ScrollView
        className="flex-1 px-3"
        contentContainerClassName="grow pt-10 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex pb-10 gap-2">
          <H2 className="border-0 pb-0">Settings</H2>
        </View>

        <View className="flex-1 flex flex-col gap-4">
          <UserInfoSection user={user} />

          <AppSettingsSection />

          <AccountSection />

          <ProfileSection />

          <SecuritySection />

          <View className="flex-1 items-center">
            <Muted className="text-xs">
              Version {version} | &copy; {new Date().getFullYear()}
            </Muted>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
