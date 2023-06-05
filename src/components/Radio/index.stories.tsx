import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import Radio_ from "./index";

export default {
  title: "components/Radio",
  component: Radio_,
  args: {
    disabled: false,
    isSelected: true,
    testID: "radio",
  },
  argTypes: {
    onPress: {
      action: "onPress",
      table: {
        disable: true,
      },
    },
    testID: {
      table: {
        disable: true,
      },
    },
    value: {
      type: "boolean",
      table: {
        disable: true,
      },
    },
  },
};

export const Radio: ComponentStory<typeof Radio_> = args => {
  return <Radio_ {...args} />;
};

Radio.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const radio = canvas.getByTestId(args.testID as string);
  await expect(radio).toBeVisible();

  if (!args.disabled) {
    await userEvent.click(radio);
    await expect(args.onPress).toBeCalled();
  }
};
