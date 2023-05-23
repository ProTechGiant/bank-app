import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useState } from "react";

import { InfoFilledCircleIcon } from "@/assets/icons";

import Alert_ from "./index";

export default {
  title: "components/Alert",
  component: Alert_,
  args: {
    message: "Content",
    icon: <InfoFilledCircleIcon />,
    clearTestID: "Alert-clear-test",
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
} as ComponentMeta<typeof Alert_>;

export const Alert: ComponentStory<typeof Alert_> = args => {
  return <Alert_ {...args} />;
};

export const AlertCloseEndButton: ComponentStory<typeof Alert_> = args => {
  return <Alert_ {...args} end={<Alert_.CloseEndButton onPress={() => {}} />} />;
};

export const AlertExpandableEndButton: ComponentStory<typeof Alert_> = args => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Alert_
      {...args}
      end={
        <Alert_.ExpandEndButton
          onPress={() => {
            setIsExpanded(!isExpanded);
          }}
          expanded={isExpanded}
        />
      }
    />
  );
};

Alert.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText(args.message)).toBeInTheDocument();

  await userEvent.click(canvas.getByTestId(args.endTestId as string));
  await expect(args.end).toHaveBeenCalled();
};
