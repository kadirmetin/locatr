import API from '../axios-client';

export const getAllDevicesQueryFunction = async () => {
  const { data } = await API.get('/device/get-all-devices');

  return data.devices;
};

export const deleteDeviceMutationFunction = async (deviceId: string) => {
  const { data } = await API.delete(`/device/delete-device/${deviceId}`);

  return data;
};
