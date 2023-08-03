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

export interface TaskType {
  ActionId: string;
  ActionTypeId: string;
  DueDate: string;
  Description: string;
  Persistent: boolean;
  ServiceId: string;
  MessageId: string;
  MessageText: string;
  RedirectDestinationLink: string;
  UpdatedBy: string;
  ButtonName: string;
  SecondaryButtonName: string;
}

type CustomerConfigurationType =
  | { IsVisible: true; SectionIndex: number }
  | { IsVisible: false; SectionIndex?: number };

export interface ShortcutType {
  Id: string;
  Name: string;
  "Shortcut Icon": string;
  Description: string;
  Link: {
    screen: string;
    stack: keyof AuthenticatedStackParams;
  };
  CustomerConfiguration: CustomerConfigurationType;
}
