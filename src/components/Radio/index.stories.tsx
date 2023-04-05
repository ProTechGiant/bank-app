import { ComponentStory } from "@storybook/react";

import Radio_ from "./index";

export default {
  title: "components/Radio",
  component: Radio_,
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
    value: {
      type: "boolean",
    },
  },
};

export const Radio: ComponentStory<typeof Radio_> = args => {
  return <Radio_ {...args} />;
};
