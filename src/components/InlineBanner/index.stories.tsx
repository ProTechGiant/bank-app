import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { UserIcon } from "@/assets/icons";

import InlineBanner_ from "./index";

export default {
  title: "components/InlineBanner",
  component: InlineBanner_,
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue",
    variant: "default",
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

export const InlineBanner: ComponentStory<typeof InlineBanner_> = args => {
  return <InlineBanner_ {...args} icon={<UserIcon width={20} height={20} />} />;
};

InlineBanner.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const closeButton = canvas.getByTestId(`${args.testID}-->CloseButton`);

  await expect(canvas.getByTestId(args.testID as string)).toBeVisible();

  await userEvent.click(closeButton);
  await expect(args.onClose).toBeCalled();
};
