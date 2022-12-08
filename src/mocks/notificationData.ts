export const notificationData = [
  {
    action_id: "1",
    action_type: "Top-Up",
    action_status: "pending",
    action_title: "90 days to activate your account",
    action_message:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ",
    action_link: "some page url",
    action_button_text: "Top up",
  },
  {
    action_id: "2",
    action_type: "Apply for  Card",
    action_status: "pending",
    action_title: "Order a card",
    action_message:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ",
    action_link: "some page url",
    action_button_text: "Apply",
  },
  {
    action_id: "3",
    action_type_id: "Lifestyle Prefs",
    action_status: "completed",
    action_title: "Preferences",
    action_message: "Set Lifestyle Preferences",
    action_link: "some page url",
    action_button_text: "Set",
  },
];

export interface notificationDataType {
  action_id: string;
  action_type_id: string;
  action_status: string;
  action_title: string;
  action_message: string;
  action_link: string;
  action_button_text: string;
}
