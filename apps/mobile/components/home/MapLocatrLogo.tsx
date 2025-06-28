import React from "react";
import { View } from "react-native";

import Logo from "~/assets/logo.svg";
import LogoDark from "~/assets/logo-black.svg";
import { useColorScheme } from "~/hooks/use-color-scheme";

import { H4 } from "../ui/typography";

const MapLocatrLogo = () => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="absolute top-4 left-5 z-10">
      <View className="flex flex-row items-center gap-2 p-2 bg-background rounded-xl">
        <>
          {isDarkColorScheme ? (
            <Logo width={32} height={32} />
          ) : (
            <LogoDark width={32} height={32} />
          )}
        </>

        <H4 className="uppercase text-primary">Locatr</H4>
      </View>
    </View>
  );
};

export default MapLocatrLogo;
