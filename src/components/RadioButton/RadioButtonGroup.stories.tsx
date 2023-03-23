import { ComponentStory } from "@storybook/react";

import RadioButtonGroup from "./RadioButtonGroup";

export default {
  title: "components/RadioButton/RadioButtonGroup",
  component: RadioButtonGroup,
  args: {
    radioButtons: [
      {
        id: "1",
        label: "Option 1",
        value: "option1",
      },
      {
        id: "2",
        label: "Option 2",
        value: "option2",
        disabled: true,
      },
    ],
    hasDivider: true,
  },
  argTypes: {
    radioButtons: {
      table: {
        disable: false,
      },
    },
    hasDivider: {
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

export const RadioButton: ComponentStory<typeof RadioButtonGroup> = args => {
  return <RadioButtonGroup {...args} />;
};
