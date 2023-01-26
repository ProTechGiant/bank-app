import { ComponentStory } from "@storybook/react";

import { UserIcon } from "@/assets/icons";

import Toast_ from "./index";

export default {
  title: "components/Toast",
  component: Toast_,
  args: {
    message: "Hello World",
    visible: true,
  },
};

export const Toast: ComponentStory<typeof Toast_> = args => {
  return <Toast_ {...args} icon={<UserIcon />} />;
};
