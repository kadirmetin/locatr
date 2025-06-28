import { Tabs } from "expo-router";

import CustomTabBar from "~/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
