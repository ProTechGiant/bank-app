import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, waitFor, within } from "@storybook/testing-library";

import Toggle_ from ".";

export default {
  title: "components/Toggle",
  component: Toggle_,
  args: {
    value: false,
    testID: "toggle",
  },
  argTypes: {
    testID: {
      table: {
        disable: true,
      },
    },
    onPress: { action: "pressed" },
  },
};

export const Toggle: ComponentStory<typeof Toggle_> = args => {
  return <Toggle_ {...args} />;
};

Toggle.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const toggle = canvas.getByTestId(args.testID as string);
  await expect(toggle).toBeVisible();

  await waitFor(() => fireEvent.click(toggle));
  await expect(args.onPress).toHaveBeenCalled();
};
