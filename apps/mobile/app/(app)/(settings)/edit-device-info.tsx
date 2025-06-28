import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { editDeviceMutationFunction } from "~/api/device.api";
import EditDeviceInfoForm from "~/components/settings/EditDeviceInfoForm";
import { Button } from "~/components/ui/button";
import { H3 } from "~/components/ui/typography";
import { useDevice } from "~/hooks/use-device";
import {
  DeviceInfoFormData,
  IoniconsName,
} from "~/lib/schemas/deviceInfoSchema";

const EditDeviceInfoScreen = () => {
  const { data: initialDeviceInfo, isLoading, deviceId, refetch } = useDevice();
  const { mutateAsync: EditDeviceInfo, isPending: isEditing } = useMutation({
    mutationFn: editDeviceMutationFunction,
  });
  const router = useRouter();

  const onSubmit = async (data: DeviceInfoFormData) => {
    try {
      await EditDeviceInfo({
        deviceId: deviceId as string,
        data: {
          deviceName: data.deviceName,
          deviceIcon: data.deviceIcon,
        },
      });

      refetch();

      ToastAndroid.show("Device information updated", ToastAndroid.SHORT);

      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update device information");
      console.error(error);
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
          contentContainerClassName="grow pb-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row items-center pt-4 pb-6 gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} className="color-primary" />
            </Button>
            <H3>Edit Device Info</H3>
          </View>

          <View className="flex-1 gap-8">
            <EditDeviceInfoForm
              isLoading={isLoading || isEditing}
              initialValues={{
                deviceIcon: initialDeviceInfo?.deviceIcon as IoniconsName,
                deviceName: initialDeviceInfo?.deviceName as string,
              }}
              onSubmit={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditDeviceInfoScreen;
