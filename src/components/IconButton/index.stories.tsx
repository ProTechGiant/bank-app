import { ComponentStory } from "@storybook/react";

import { ChatIcon } from "@/assets/icons";

import IconButton_ from "./index";

export default {
  title: "components/IconButton",
  component: IconButton_,
  args: {
    changeBackgroundColor: true,
    active: true,
    disabled: false,
    icon: <ChatIcon />,
    activeLabel: "Icon Text",
    inactiveLabel: "In-active text",
    testID: "IconButton",
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
    changeBackgroundColor: {
      table: {
        disable: false,
      },
    },
  },
};

export const IconButton: ComponentStory<typeof IconButton_> = args => {
  return <IconButton_ {...args} />;
};
