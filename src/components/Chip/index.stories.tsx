import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { PostcardIcon } from "@/assets/icons";

import Chip_ from "./index";

export default {
  title: "components/Chip",
  component: Chip_,
  args: {
    title: "Content",
    isRemovable: true,
    isSelected: false,
    leftIcon: <PostcardIcon />,
    testID: "chip",
  },
  argTypes: {
    testID: {
      table: {
        disable: true,
      },
    },
    leftIcon: {
      table: {
        disable: true,
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

export const Chip: ComponentStory<typeof Chip_> = args => {
  return <Chip_ {...args} />;
};

Chip.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const chip = canvas.getByTestId(args.testID as string);
  await expect(chip).toBeVisible();

  await userEvent.click(chip);
  await expect(args.onPress).toBeCalled();
};
