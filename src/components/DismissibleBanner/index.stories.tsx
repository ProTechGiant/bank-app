import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { within } from "@storybook/testing-library";

import { UserIcon } from "@/assets/icons";

import DismissibleBanner_ from "./index";

export default {
  title: "components/DismissibleBanner",
  component: DismissibleBanner_,
  args: {
    message: "Hello World",
    visible: true,
    testID: "dismissible-banner",
  },
  argTypes: {
    testID: {
      table: {
        disable: true,
      },
    },
  },
};

export const DismissibleBanner: ComponentStory<typeof DismissibleBanner_> = args => {
  return <DismissibleBanner_ {...args} icon={<UserIcon color="#ffffff" />} />;
};

DismissibleBanner.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByTestId(args.testID as string)).toBeVisible();
};
