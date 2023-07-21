import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import Alert_ from "./index";

export default {
  title: "components/Alert",
  component: Alert_,
  args: {
    message: "Content",
    clearTestID: "Alert-clear-test",
    variant: "success",
    endTestId: "endTestId",
  },
  argTypes: {
    variant: {
      options: ["success", "error", "refresh", "warning", "default"],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Alert_>;

export const Alert: ComponentStory<typeof Alert_> = args => {
  return <Alert_ {...args} />;
};

export const AlertCloseEndButton: ComponentStory<typeof Alert_> = args => {
  return <Alert_ {...args} end={<Alert_.CloseEndButton onPress={() => {}} />} />;
};

let isExpanded = false;

const handleOnPressExpanded = () => {
  isExpanded = !isExpanded;
};

export const AlertExpandableEndButton: ComponentStory<typeof Alert_> = args => {
  return <Alert_ {...args} end={<Alert_.ExpandEndButton onPress={handleOnPressExpanded} expanded={isExpanded} />} />;
};

AlertExpandableEndButton.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText(args.message)).toBeInTheDocument();
  await userEvent.click(canvas.getByTestId(args.endTestId as string));

  await expect(isExpanded).toBe(true);
  await userEvent.click(canvas.getByTestId(args.endTestId as string));
  await expect(isExpanded).toBe(false);
};
