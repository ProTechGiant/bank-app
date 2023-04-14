import { REWARDS_ID, TRANSFERS_ID, YOUR_ACCOUNT_ID, YOUR_MONEY_ID } from "./constants";
import { Categories } from "./types";

// This comment is for testing our PR flow

export const mockNotificationManagementCategories: Categories[] = [
  {
    categoryId: TRANSFERS_ID,
    categoryName: "Transfers",
    categoryDescription: "Get notifications about payments and card transactions.",
    subCategories: [
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
        subCategoryName: "Payments in",
        subCategoryDescription: "When money is paid into your account",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: false,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399722",
        subCategoryName: "Payments out",
        subCategoryDescription: "When money leaves your account",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: false,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399723",
        subCategoryName: "Scheduled payment changes",
        subCategoryDescription: "When scheduled payments and subscriptions are set up, changed or cancelled",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: false,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399724",
        subCategoryName: "Bill payments",
        subCategoryDescription: "When a bill is due to be paid",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: false,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399725",
        subCategoryName: "Beneficiary",
        subCategoryDescription: "When you add or remove a beneficiary",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: false,
          },
        ],
      },
    ],
  },
  {
    categoryId: YOUR_MONEY_ID,
    categoryName: "Your money",
    categoryDescription: "Get notifications about how you use your money.",
    subCategories: [
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
        subCategoryName: "Spending summaries",
        subCategoryDescription: "How you use your card and your account",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399722",
        subCategoryName: "Your goals",
        subCategoryDescription: "When you've reached a goal, and reminders to help you get there",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399723",
        subCategoryName: "Low balance",
        subCategoryDescription: "Whenever your balance drops below XXX",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
    ],
  },
  {
    categoryId: YOUR_ACCOUNT_ID,
    categoryName: "Your account",
    categoryDescription: "Get notifications about changes and updates to your account and statements",
    subCategories: [
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
        subCategoryName: "Changes to your account",
        subCategoryDescription: "When there are changes to your email or password, or a new login",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399722",
        subCategoryName: "Changes to your card",
        subCategoryDescription: "When your card is due to expire, is frozen or is unfrozen",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399723",
        subCategoryName: "Statements",
        subCategoryDescription: "When your account statement is ready",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
    ],
  },
  {
    categoryId: REWARDS_ID,
    categoryName: "Using Croatia",
    categoryDescription: "Get notifications about your rewards and new content",
    subCategories: [
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399721",
        subCategoryName: "Expiring rewards",
        subCategoryDescription: "When your rewards are going to run out",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399722",
        subCategoryName: "New rewards",
        subCategoryDescription: "When new rewards are available",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
      {
        subCategoryId: "0ac9cabe-0dfb-478d-bc0d-188329399723",
        subCategoryName: "New content",
        subCategoryDescription: "When new content drops",
        selectedChannels: [
          {
            channelId: "9744b75c-e6c6-43ab-98fe-5d9ed8f8925b",
            channelName: "PUSH",
            isSelected: true,
          },
        ],
      },
    ],
  },
];
