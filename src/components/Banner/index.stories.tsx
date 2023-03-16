import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { InfoFilledCircleIcon } from "@/assets/icons";

import Banner_ from "./index";

export default {
  title: "components/Banner",
  component: Banner_,
  args: {
    message: "Content",
    icon: <InfoFilledCircleIcon />,
    label: "Label",
    clearTestID: "banner-clear-test",
  },
  argTypes: {
    icon: {
      table: {
        disable: true,
      },
    },
    clearTestID: {
      table: {
        disable: true,
      },
    },
    onClear: {
      action: "onClear",
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Banner_>;

export const Banner: ComponentStory<typeof Banner_> = args => {
  return <Banner_ {...args} />;
};

Banner.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText(args.message)).toBeInTheDocument();

  await userEvent.click(canvas.getByTestId(args.endTestId as string));
  await expect(args.end).toHaveBeenCalled();
};
