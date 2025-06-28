import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { getDeviceQueryFunction } from "~/api/device.api";
import { getPersistentDeviceId } from "~/lib/getDeviceInfo";
import { DeviceType } from "~/lib/types/device.type";

type DeviceResponse = { device: DeviceType; message: string };

export const useDevice = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    getPersistentDeviceId().then(setDeviceId);
  }, []);

  const query = useQuery<DeviceResponse, Error, DeviceType>({
    queryKey: ["device-info", deviceId],
    queryFn: () => getDeviceQueryFunction(deviceId as string),
    select: (data) => data.device,
    enabled: Boolean(deviceId),
    staleTime: Infinity,
  });

  return { deviceId, ...query } as const;
};
