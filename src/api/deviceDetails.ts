import { Platform } from "react-native";
import { getDeviceName, getModel, getVersion } from "react-native-device-info";

import { getUniqueDeviceId } from "@/utils";

export async function getDeviceInfo(): Promise<{ [key: string]: string }> {
  const deviceId = await getUniqueDeviceId();
  const deviceName = await getDeviceName();
  const deviceModel = getModel();
  const deviceOsVersion = getVersion();

  return {
    ["X-Device-Id"]: deviceId,
    ["X-Device-Name"]: deviceName,
    ["x-device-os"]: Platform.OS === "ios" ? "01" : "02",
    ["x-device-model"]: deviceModel,
    ["x-device-os-version"]: deviceOsVersion,
    ["x-device-location"]: "KSA", // TODO: should be updated once there is location within the app
  };
}
