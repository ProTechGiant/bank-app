import { RemoteMessage } from "@/utils/push-notifications";

export const mockRemoteMessage: RemoteMessage = {
  notificationId: "1",
  data: {
    type: "edit-goal",
    additionalParams: {
      amount: "100",
    },
  },
};
