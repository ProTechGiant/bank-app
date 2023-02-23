import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { UserIcon } from "@/assets/icons";

import ToastBanner_ from "./index";

export default {
  title: "components/ToastBanner",
  component: ToastBanner_,
  args: {
    title: "Default",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue",
    testID: "toast-banner",
  },
  argTypes: {
    testID: {
      table: {
        disable: true,
      },
    },
    icon: {
      table: {
        disable: true,
      },
    },
    onClose: {
      action: "onClose",
      table: {
        disable: true,
      },
    },
  },
};

export const ToastBanner: ComponentStory<typeof ToastBanner_> = args => {
  return <ToastBanner_ {...args} icon={<UserIcon width={20} height={20} />} />;
};

ToastBanner.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const closeButton = canvas.getByTestId(`${args.testID}-->CloseButton`);

  await expect(canvas.getByTestId(args.testID as string)).toBeVisible();

  await userEvent.click(closeButton);
  await expect(args.onClose).toBeCalled();
};
