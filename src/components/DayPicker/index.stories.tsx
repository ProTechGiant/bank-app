import { useState } from "@storybook/addons";
import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import DayPicker_ from "./index";

export default {
  title: "components/DayPicker",
  component: DayPicker_,
  argTypes: {
    onClose: {
      action: "onClose",
      table: {
        disable: true,
      },
    },
    onChange: {
      action: "onChange",
      table: {
        disable: true,
      },
    },
    onConfirm: {
      action: "onConfirm",
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
    isVisible: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    buttonText: "Set",
    headerText: "Pick a day",
    helperText: "Please pick any day of the month",
  },
  parameters: {
    layout: "centered",
    viewport: {
      defaultViewport: "Custom viewport",
      viewports: [
        {
          name: "Custom viewport",
          styles: {
            backgroundColor: "gray",
            height: "500px",
            width: "414px",
          },
        },
      ],
    },
  },
} as ComponentMeta<typeof DayPicker_>;

export const DayPicker: ComponentStory<typeof DayPicker_> = args => {
  const [value, setValue] = useState(new Date().getDate());

  const handleOnChange = (nextValue: number) => {
    setValue(nextValue);
    args?.onChange?.(nextValue);
  };

  return <DayPicker_ {...args} onChange={v => handleOnChange(v)} value={value} isVisible />;
};

DayPicker.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  const day11Button = canvas.getByText("11");
  await expect(day11Button).toBeVisible();
  await userEvent.click(day11Button);
  await expect(args.onChange).toBeCalledWith(11);

  const confirmButton = canvas.getByText(args.buttonText);
  await expect(confirmButton).toBeVisible();
  await userEvent.click(confirmButton);
  await expect(args.onConfirm).toBeCalled();
};
