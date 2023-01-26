import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import Button from "./index";

export default {
  title: "components/Button",
  component: Button,
  argTypes: {
    disabled: {
      control: "boolean",
    },
    iconLeft: {
      table: {
        disable: true,
      },
    },
    iconRight: {
      table: {
        disable: true,
      },
    },
    onPress: {
      action: "clicked",
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Button>;

export const TextButton: ComponentStory<typeof Button> = args => <Button {...args}>Hello World!</Button>;
TextButton.args = { variant: "primary" };
TextButton.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByText("Hello World!"));
  await expect(args.onPress).toHaveBeenCalled();
};

export const LoadingButton: ComponentStory<typeof Button> = args => <Button {...args}>Loading button</Button>;
LoadingButton.args = { type: "loader" };
