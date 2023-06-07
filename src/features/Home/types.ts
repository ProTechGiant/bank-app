import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

export interface Notification {
  action_id: string;
  action_type: string;
  action_status: string;
  action_title: string;
  action_message: string;
  action_link: keyof AuthenticatedStackParams;
  action_button_text: string;
}

export interface HomepageItemLayoutType {
  name: string;
  type: string;
  description: string;
}
