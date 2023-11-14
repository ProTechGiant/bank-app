import { PendingGoalCardType } from "../types";

export const tags = ["House", "Car", "Holiday", "Wedding", "Business", "Iphone", "Diamond"];
export const CUSTOMER_GOALS = [
  {
    name: "Rainy Day",
    percentage: 100,
    totalAmount: 50400,
    dueDate: new Date(new Date().setMonth(9)),
    imageUri:
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/lone-palm-tree-on-small-island-john-lund.jpg",
  },
  {
    name: "Summer Vacation",
    percentage: 65,
    totalAmount: 6500,
    dueDate: new Date(new Date().setMonth(9)),
    imageUri:
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/lone-palm-tree-on-small-island-john-lund.jpg",
  },
  {
    name: "Dream House",
    percentage: 15,
    totalAmount: 300000,
    dueDate: new Date(new Date().setFullYear(2022)),
    imageUri:
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/lone-palm-tree-on-small-island-john-lund.jpg",
  },
  {
    name: "Porsche",
    percentage: 74,
    totalAmount: 98000,
    dueDate: new Date(new Date().setMonth(9)),
    imageUri:
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/lone-palm-tree-on-small-island-john-lund.jpg",
  },
];
export const PENDING_GOALS: PendingGoalCardType[] = [
  {
    name: "Rainy Day",
    total: 3,
    completed: 1,
  },
  {
    name: "Car",
    total: 1,
    completed: 0,
  },
];
