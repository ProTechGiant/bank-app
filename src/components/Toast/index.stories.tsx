import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { within } from "@storybook/testing-library";

import Toast_ from "./index";

export default {
  title: "components/Toast",
  component: Toast_,
  args: {
    message: "Your goal has been created",
    testID: "toast",
    variant: "confirm",
  },
  argTypes: {
    icon: {
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
};

export const Toast: ComponentStory<typeof Toast_> = args => {
  return <Toast_ {...args} />;
};

Toast.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByTestId(args.testID as string)).toBeVisible();
};
