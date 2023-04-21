import { NativeModules } from "react-native";
import { checkNotifications, requestNotifications } from "react-native-permissions";

interface T2PushNotificationsModuleDef {
  registerForNotifications: () => Promise<void>;
  registerWithT2: (phoneNumber: string) => Promise<void>;
}

const T2PushNotificationsModule = NativeModules.T2PushNotificationsModule as T2PushNotificationsModuleDef;

export default {
  ...T2PushNotificationsModule,
  requestPermissions: async () => {
    const response = await checkNotifications();

    // not available or not cnnot request
    if (response.status === "unavailable" || response.status === "blocked" || response.status === "limited") {
      return false;
    }

    // granted permission
    if (response.status === "granted") {
      return true;
    }

    const { status } = await requestNotifications(["alert", "sound", "badge"]);

    return status === "granted";
  },
};
