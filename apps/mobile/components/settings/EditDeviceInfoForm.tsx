import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";

import {
  DeviceInfoFormData,
  deviceInfoSchema,
  IoniconsName,
} from "~/lib/schemas/deviceInfoSchema";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { P, Small } from "../ui/typography";

interface EditDeviceInfoFormProps {
  onSubmit: (data: DeviceInfoFormData) => void;
  isLoading: boolean;
  initialValues?: DeviceInfoFormData;
}

const ICONS: IoniconsName[] = [
  "phone-portrait-outline",
  "home-outline",
  "heart-outline",
  "accessibility-outline",
  "game-controller-outline",
  "umbrella-outline",
  "earth-outline",
  "paw-outline",
  "person-outline",
  "diamond-outline",
  "briefcase-outline",
  "flash-outline",
  "flower-outline",
  "happy-outline",
];

const EditDeviceInfoForm = ({
  onSubmit,
  isLoading,
  initialValues = {
    deviceName: "",
    deviceIcon: "phone-portrait-outline" as IoniconsName,
  },
}: EditDeviceInfoFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<DeviceInfoFormData>({
    resolver: zodResolver(deviceInfoSchema),
    defaultValues: initialValues,
  });

  const selectedIcon = watch("deviceIcon");

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Controller
          control={control}
          name="deviceName"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <View className="gap-2">
              <Label nativeID="deviceName">
                <Small>Device Name</Small>
              </Label>
              <Input
                ref={ref}
                className={`${errors.deviceName ? "border-2 border-red-500" : ""}`}
                aria-labelledby="deviceName"
                placeholder="Enter device name"
                size="lg"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isLoading}
                selectTextOnFocus={!isLoading}
              />

              {errors.deviceName && (
                <P className="text-red-500">{errors.deviceName.message}</P>
              )}
            </View>
          )}
        />
      </View>

      <View className="gap-2">
        <Label nativeID="deviceIcon">
          <Small>Device Icon</Small>
        </Label>
        <Controller
          control={control}
          name="deviceIcon"
          render={({ field: { onChange } }) => (
            <View>
              <View className="flex flex-row flex-wrap gap-2">
                {ICONS.map((iconName) => (
                  <Button
                    key={iconName}
                    variant={selectedIcon === iconName ? "default" : "outline"}
                    size="icon"
                    className={`flex items-center justify-center w-12 h-12 ${
                      selectedIcon === iconName ? "bg-primary" : "bg-secondary"
                    }`}
                    aria-labelledby="deviceIcon"
                    onPress={() => onChange(iconName)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={iconName}
                      size={24}
                      className={`${selectedIcon === iconName ? "color-secondary" : "color-primary"}`}
                    />
                  </Button>
                ))}
              </View>

              {errors.deviceIcon && (
                <P className="text-red-500">{errors.deviceIcon.message}</P>
              )}
            </View>
          )}
        />
      </View>

      <View className="mt-4">
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading || !isDirty}
          className="py-4"
        >
          {isLoading ? (
            <View className="flex flex-row items-center justify-center">
              <ActivityIndicator size="small" className="color-primary mr-2" />
              <Text className="text-secondary">Saving...</Text>
            </View>
          ) : (
            <Text className="text-secondary">Save</Text>
          )}
        </Button>
      </View>
    </View>
  );
};

export default memo(EditDeviceInfoForm);
