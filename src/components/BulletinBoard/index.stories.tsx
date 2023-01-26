import { ComponentStory } from "@storybook/react";

import { Notification } from "@/types/notification";

import BulletinBoard_ from "./index";

export default {
  title: "components/BulletinBoard",
  component: BulletinBoard_,
  args: {
    title: "Example board",
  },
  argTypes: {
    data: {
      table: {
        disable: true,
      },
    },
  },
};

const data: Notification[] = [
  {
    action_id: "1",
    action_type: "nothing",
    action_status: "pending",
    action_title: "Hello World!",
    action_message: "How are you doing?",
    action_link: "Home.Dashboard",
    action_button_text: "Go to dashboard",
  },
];

export const BulletinBoard: ComponentStory<typeof BulletinBoard_> = args => {
  return <BulletinBoard_ {...args} data={data} />;
};
