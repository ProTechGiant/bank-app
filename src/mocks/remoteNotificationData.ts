import { RemoteMessage } from "@/utils/push-notifications";

export const mockRemoteMessageDocuments: RemoteMessage = {
  notificationId: "1",
  data: {
    type: "document-status",
    //using this dummy link of type goto/StackName/ScreenName?param1=value1&param2=value2
    url: "goto/Documents.DocumentsStack/Documents.DocumentsScreen",
    additionalParams: {},
    message: "Your requested document IBAN Letter has been Approved.",
    messageType: "success",
  },
};

export const mockRemoteMessageAppreciation: RemoteMessage = {
  notificationId: "1",
  data: {
    type: "Appreciation",
    //using this dummy link of type goto/StackName/ScreenName?param1=value1&param2=value2
    url: "goto/Appreciation.AppreciationStack/Appreciation.HubScreen",
    additionalParams: {},
    message: "A new Appreciation has been released",
    messageType: "success",
  },
};
