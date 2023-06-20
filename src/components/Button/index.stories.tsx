import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import Button from "./index";

export default {
  title: "components/Button",
  component: Button,
  args: {
    children: "Hello World",
    size: "regular",
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "tertiary", "warning"],
      control: { type: "radio" },
    },
    size: {
      options: ["regular", "small", "mini"],
      control: { type: "radio" },
    },
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
      action: "onPress",
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Button>;

export const TextButton: ComponentStory<typeof Button> = args => <Button {...args} />;
TextButton.args = { variant: "primary" };
TextButton.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByText(args.children as string));
  await expect(args.onPress).toHaveBeenCalled();
};

export const LoadingButton: ComponentStory<typeof Button> = args => <Button {...args}>Loading button</Button>;
LoadingButton.args = { loading: true };
