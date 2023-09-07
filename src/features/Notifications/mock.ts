const SubCategories: SubCategoryType[] = [
  {
    Id: 1,
    Name: "category1",
  },
  {
    Id: 2,
    Name: "category2",
  },
  {
    Id: 3,
    Name: "category3",
  },
];
import { NotificationType, SubCategoryType } from "./types";

export const Notifications: NotificationType<Date>[] = [
  {
    NotificationId: 1,
    NotificationName: "New Rewards",
    MessageContent: "You've earnet cash for recommending Croatia\nThank you for spreading the world",
    CreatedOn: new Date(),
    SubCategoryScreen: "",
    SubCategoryStack: "",
    SubCategories: [SubCategories[0]],
  },
  {
    NotificationId: 2,
    NotificationName: "Saving Account Success",
    MessageContent: "Dear customer Welcoming to the Croatian bank Your savings account is now open, and you may use...",
    CreatedOn: new Date(new Date().setDate(new Date().getDate() - 1)),
    SubCategoryScreen: "",
    SubCategoryStack: "",
    SubCategories: [SubCategories[1]],
  },
  {
    NotificationId: 3,
    NotificationName: "Bill Payments",
    MessageContent: "We would like to remind you that your bill name bill is due on Aug 12, 2023.",
    CreatedOn: new Date(new Date().setDate(new Date().getDate() - 2)),
    SubCategoryScreen: "",
    SubCategoryStack: "",
    SubCategories,
  },
  {
    NotificationId: 4,
    NotificationName: "New Content",
    MessageContent: "Thank you for joining Croatia.\nYou've received 15 SAR, paid into your account",
    CreatedOn: new Date(),
    SubCategoryScreen: "",
    SubCategoryStack: "",
    SubCategories: [SubCategories[2]],
  },
  {
    NotificationId: 5,
    NotificationName: "Payment Out",
    MessageContent:
      "We are pleased to inform you that your transfer of 1,000 SAR to Ahmad Abdul Aziz has been successfully authorized.",
    CreatedOn: new Date(),
    SubCategoryScreen: "",
    SubCategoryStack: "",
    SubCategories,
  },
];
