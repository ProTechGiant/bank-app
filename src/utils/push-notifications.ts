import { NativeModules } from "react-native";
import { checkNotifications, requestNotifications } from "react-native-permissions";

import { mockRemoteMessage } from "@/mocks/remoteNotificationData";

//TODO: replace with original type , once integration is complete
export interface RemoteMessage {
  notificationId: string;
  data: {
    type: "saving-goal" | "edit-goal" | "withdraw-goal" | "fund-goal" | "statement-status"; // saving-goal, edit-goal, withdraw-goal, fund-goal, "statement-status"
    additionalParams: object;
    url: string;
  };
}

interface T2PushNotificationsModuleDef {
  registerForNotifications: () => Promise<void>;
  registerWithT2: (phoneNumber: string) => Promise<void>;
  //TODO: replace with original method , once integration is complete
  onReceiveNotification: (listener: (remoteMessage: RemoteMessage) => any) => Promise<void>;
  onReceivePushToken: (listener: (pushToken: string) => Promise<void>) => Promise<void>;
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
  onReceiveNotification: async (): Promise<RemoteMessage> => {
    return mockRemoteMessage;
  },
};
