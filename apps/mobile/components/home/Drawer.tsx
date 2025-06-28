"use client";

import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNetworkState } from "expo-network";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

import { useAuthContext } from "~/context/auth-context";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { useDevice } from "~/hooks/use-device";
import { IoniconsName } from "~/lib/schemas/deviceInfoSchema";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetModalType,
  BottomSheetScrollView,
} from "../ui/bottom-sheet";
import { H4, P } from "../ui/typography";
import DrawerButton from "./DrawerButton";

interface DrawerProps {
  isTracking: boolean;
  connectionStatus: string;
  startTracking: () => void;
  stopTracking: () => void;
  error: string;
  warning: string;
  batteryLevel: number | null;
}

const Drawer = ({
  isTracking,
  connectionStatus,
  startTracking,
  stopTracking,
  error,
  warning,
  batteryLevel,
}: DrawerProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const { user } = useAuthContext();
  const { data: DeviceInfo } = useDevice();
  const networkState = useNetworkState();

  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const dynamicStyles = useMemo(
    () => ({
      backgroundStyle: {
        backgroundColor: isDarkColorScheme ? "#0A0A12" : "#FAFAFA",
      },
      handleIndicatorStyle: {
        backgroundColor: isDarkColorScheme ? "#FAFAFA" : "#0A0A12",
        width: 40,
        height: 4,
      },
      handleStyle: {
        borderRadius: 12,
      },
    }),
    [isDarkColorScheme],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, snapPoints.length - 1));
      setCurrentSnapIndex(validIndex);
    },
    [snapPoints.length],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderMainContent = () => (
    <View className="gap-4 mb-4">
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-3/4 gap-1">
          <H4>Welcome back, {user?.firstName} 👋</H4>
          {isTracking ? (
            <P>Locatr, tracking this device.</P>
          ) : (
            <P>Locatr, is currently not tracking this device.</P>
          )}
        </View>
        <View className="w-1/4 flex items-center justify-center">
          <DrawerButton
            connectionStatus={connectionStatus}
            isTracking={isTracking}
            startTracking={startTracking}
            stopTracking={stopTracking}
          />
        </View>
      </View>

      <View className="border border-muted-foreground bg-muted p-4 rounded-lg">
        <P className="capitalize">{connectionStatus}</P>
        {error && <P className="text-red-500">{error}</P>}
      </View>
    </View>
  );

  const renderExpandedContent = () => {
    return (
      <View className="pt-4 gap-4 border-t border-muted-foreground">
        {/* Warning Area */}
        {warning && (
          <View className="border-muted-foreground bg-muted p-4 rounded-xl">
            <P className="text-yellow-500">{warning}</P>
          </View>
        )}

        {/* Header */}
        <View className="flex flex-row items-center gap-3 mb-4">
          <Ionicons
            name={(DeviceInfo?.deviceIcon as IoniconsName) || "home"}
            size={22}
            className="color-primary"
          />
          <H4>{DeviceInfo?.deviceName || "Unknown Device"}</H4>
        </View>

        {/* Stats */}
        <View className="gap-4">
          {/* Battery Level */}
          <View>
            <View className="flex flex-row items-center gap-3 mb-1">
              <Ionicons
                name="battery-full-outline"
                size={20}
                className="color-primary"
              />
              <P className="text-sm text-muted-foreground">Battery Level</P>
            </View>
            <P className="font-semibold text-lg ml-8">%{batteryLevel}</P>
          </View>

          {/* Network Type */}
          <View>
            <View className="flex flex-row items-center gap-3 mb-1">
              <Entypo name="network" size={20} className="color-primary" />
              <P className="text-sm text-muted-foreground">Network</P>
            </View>
            <P className="font-semibold text-lg ml-8 capitalize">
              {networkState.type}
            </P>
          </View>

          {/* Connection Status */}
          <View>
            <View className="flex flex-row items-center gap-3 mb-1">
              <Ionicons
                name={
                  connectionStatus === "connected"
                    ? "cloud-done-outline"
                    : connectionStatus === "connecting"
                      ? "cloud-upload-outline"
                      : "cloud-offline-outline"
                }
                size={20}
                className="color-primary"
              />
              <P className="text-sm text-muted-foreground">Connection</P>
            </View>
            <P className="font-semibold text-lg ml-8 capitalize">
              {connectionStatus}
            </P>
          </View>

          {/* Tracking Status */}
          <View>
            <View className="flex flex-row items-center gap-3 mb-1">
              <Ionicons
                name={isTracking ? "location" : "location-outline"}
                size={20}
                className="color-primary"
              />
              <P className="text-sm text-muted-foreground">Location Tracking</P>
            </View>
            <P className="font-semibold text-lg ml-8">
              {isTracking ? "Active" : "Inactive"}
            </P>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <View className="flex justify-center items-center">
        <View className="p-1 rounded-md">
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={dynamicStyles.backgroundStyle}
            enablePanDownToClose={false}
            handleIndicatorStyle={dynamicStyles.handleIndicatorStyle}
            handleStyle={dynamicStyles.handleStyle}
            onChange={handleSheetChanges}
            animateOnMount={true}
            enableDynamicSizing={false}
          >
            <BottomSheetScrollView
              className="flex-1 p-4"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-5"
            >
              {renderMainContent()}

              {currentSnapIndex >= 1 && (
                <View className="mt-2">{renderExpandedContent()}</View>
              )}
            </BottomSheetScrollView>
          </BottomSheetModal>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

export default Drawer;
