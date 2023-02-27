import { NotificationCategoriesData } from "@/features/NotificationManagement/screens/HubScreen/types/notificationManagement";

export const mockNotificationManagementCategories: NotificationCategoriesData = {
  categories: [
    {
      categoryId: "691ed46b-94ee-4c3f-8d31-f66338d33c7f",
      categoryName: "TRANSFERS",
      categoryDescription: "Get notifications about payments and card transactions.",
      subCategories: [
        {
          subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
          subCategoryName: "INCOMING_PAYMENTS",
          subCategoryDescription: "Notifications relating to incoming direct credits, transfers and standing orders",
          selectedChannels: [
            {
              channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
              channelName: "PUSH",
            },
          ],
        },
      ],
    },
    {
      categoryId: "691ed46b-94ee-4c3f-8d31-f66338d33c7g",
      categoryName: "Your money",
      categoryDescription: "Get notifications about how you use your money.",
      subCategories: [
        {
          subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
          subCategoryName: "INCOMING_PAYMENTS",
          subCategoryDescription: "Notifications relating to incoming direct credits, transfers and standing orders",
          selectedChannels: [
            {
              channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
              channelName: "PUSH",
            },
          ],
        },
      ],
    },
    {
      categoryId: "691ed46b-94ee-4c3f-8d31-f66338d33c7h",
      categoryName: "Your account",
      categoryDescription: "Get notifications about changes and updates to your account and statements",
      subCategories: [
        {
          subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
          subCategoryName: "INCOMING_PAYMENTS",
          subCategoryDescription: "Notifications relating to incoming direct credits, transfers and standing orders",
          selectedChannels: [
            {
              channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
              channelName: "PUSH",
            },
          ],
        },
      ],
    },
    {
      categoryId: "691ed46b-94ee-4c3f-8d31-f66338d33c7i",
      categoryName: "Using Croatia",
      categoryDescription: "Get notifications about your rewards and new content",
      subCategories: [
        {
          subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
          subCategoryName: "INCOMING_PAYMENTS",
          subCategoryDescription: "Notifications relating to incoming direct credits, transfers and standing orders",
          selectedChannels: [
            {
              channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
              channelName: "PUSH",
            },
          ],
        },
      ],
    },
  ],
};
