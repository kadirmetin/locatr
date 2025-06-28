import { AxiosResponse } from "axios";

import API from "~/lib/axios-client";
import { DeviceType } from "~/lib/types/device.type";

export const addDeviceMutationFunction = async (
  data: DeviceType,
): Promise<
  AxiosResponse<{ isNew: boolean; message: string; device: DeviceType }>
> => await API.post("/device/add-device", data);

export const getDeviceQueryFunction = async (deviceId: string) => {
  const { data } = await API.get(`/device/get-device/${deviceId}`);
  return data;
};

export const editDeviceMutationFunction = async ({
  deviceId,
  data,
}: {
  deviceId: string;
  data: Partial<Pick<DeviceType, "deviceName" | "deviceIcon">>;
}): Promise<
  AxiosResponse<{
    message: string;
    device: DeviceType;
  }>
> => await API.patch(`/device/edit-device-info/${deviceId}`, data);

export const deleteDeviceMutationFunction = async (deviceId: string) => {
  const { data } = await API.delete(`/device/delete-device/${deviceId}`);

  return data;
};

export const updateDeviceNotificationPreferencesMutationFunction = async (
  deviceId: string,
) => {
  const { data } = await API.patch(
    `/device/update-notification-preferences/${deviceId}`,
  );
  return data;
};
