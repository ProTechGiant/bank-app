import { ComponentStory } from "@storybook/react";

import { ChatIcon } from "@/assets/icons";

import FeedbackButton_ from "./FeedbackButton";

export default {
  title: "components/FeedbackButton",
  component: FeedbackButton_,
  args: {
    icon: <ChatIcon />,
    text: "Icon Text",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPress: () => {},
  },
  argTypes: {
    onPress: {
      action: "onPress",
      table: {
        disable: false,
      },
    },
  },
};

export const FeedbackButton: ComponentStory<typeof FeedbackButton_> = args => {
  return <FeedbackButton_ {...args} />;
};
