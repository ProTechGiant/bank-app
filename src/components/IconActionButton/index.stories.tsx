import { ComponentStory } from "@storybook/react";

import { ChatIcon } from "@/assets/icons";

import IconActionButton_ from "./index";

export default {
  title: "components/IconActionButton",
  component: IconActionButton_,
  args: {
    active: true,
    disabled: false,
    icon: <ChatIcon />,
    label: "Icon Text",
    testID: "IconActionButton",
  },
  argTypes: {
    onPress: {
      action: "onPress",
      table: {
        disable: false,
      },
    },
    active: {
      table: {
        disable: false,
      },
    },
    disabled: {
      table: {
        disable: false,
      },
    },
  },
};

export const IconActionButton: ComponentStory<typeof IconActionButton_> = args => {
  return <IconActionButton_ {...args} />;
};
