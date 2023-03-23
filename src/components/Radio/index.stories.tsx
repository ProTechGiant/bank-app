import { ComponentStory } from "@storybook/react";

import Radio from "./index";

export default {
  title: "components/Radio",
  component: Radio,
  args: {
    disabled: false,
    color: "#002233",
  },
  argTypes: {
    disabled: {
      table: {
        disable: false,
      },
    },
    color: {
      table: {
        disable: false,
      },
    },
    onPress: {
      action: "onPress",
      table: {
        disable: true,
      },
    },
  },
};

export const RadioButton: ComponentStory<typeof Radio> = args => {
  return <Radio {...args} />;
};
