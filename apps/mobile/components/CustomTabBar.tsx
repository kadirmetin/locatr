import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MotiText, MotiView } from "moti";
import { Pressable } from "react-native";

import { Text } from "~/components/ui/text";

type ValidIcons = "home" | "settings";

interface TabBarIconProps {
  focused: boolean;
  iconName: ValidIcons;
  label: string;
}

const TabBarIcon = ({ focused, iconName, label }: TabBarIconProps) => {
  return (
    <MotiView
      className="items-center justify-center gap-1"
      animate={{ scale: focused ? 1.1 : 1 }}
      transition={{ type: "spring", damping: 10 }}
    >
      <Ionicons
        name={focused ? iconName : `${iconName}-outline`}
        size={24}
        className={`${focused ? "text-primary" : "text-muted-foreground"}`}
      />
      <MotiText
        animate={{ opacity: focused ? 1 : 0, translateY: focused ? 0 : 5 }}
        transition={{ type: "timing", duration: 150 }}
      >
        <Text
          className={`text-xs ${focused ? "text-primary font-semibold" : "text-muted-foreground font-medium"}`}
        >
          {label}
        </Text>
      </MotiText>
    </MotiView>
  );
};

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <MotiView
      className="flex-row border-t border-border py-2"
      from={{ translateY: 50 }}
      animate={{ translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: ValidIcons;
        let label: string;

        if (route.name === "home") {
          iconName = "home";
          label = "Home";
        } else if (route.name === "(settings)") {
          iconName = "settings";
          label = "Settings";
        } else {
          iconName = "home";
          label = route.name;
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            className="flex-1 items-center justify-center py-1"
            onPress={onPress}
          >
            <TabBarIcon focused={isFocused} iconName={iconName} label={label} />
          </Pressable>
        );
      })}
    </MotiView>
  );
};

export default CustomTabBar;
