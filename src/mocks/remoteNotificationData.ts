import { RemoteMessage } from "@/utils/push-notifications";

export const mockRemoteMessage: RemoteMessage = {
  notificationId: "1",
  data: {
    type: "statement-status",
    //using this dummy link of type goto/StackName/ScreenName?param1=value1&param2=value2
    url: "goto/Statements.StatementsStack/Statements.AccessStatementScreen?type=CUSTOM",
    additionalParams: {},
  },
};
