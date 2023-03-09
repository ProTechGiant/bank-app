import MainStackParams from "@/navigation/mainStackParams";

export interface Notification {
  action_id: string;
  action_type: string;
  action_status: string;
  action_title: string;
  action_message: string;
  action_link: keyof MainStackParams;
  action_button_text: string;
}
