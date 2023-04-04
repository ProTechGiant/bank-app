import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import Pill_ from "@/components/Pill";

export default {
  title: "components/Pill",
  component: Pill_,
  args: {
    isActive: false,
    text: "Default",
    testID: "pill",
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
  },
} as ComponentMeta<typeof Pill_>;

export const Pill: ComponentStory<typeof Pill_> = props => <Pill_ {...props} />;

Pill.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const pillElement = canvas.getByTestId(args.testID as string);

  await expect(pillElement).toBeVisible();
  await userEvent.click(pillElement);
  await expect(args.onPress).toBeCalled();
};
