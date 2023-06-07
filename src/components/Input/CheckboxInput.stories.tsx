import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useEffect, useState } from "react";

import { CheckboxInput as CheckboxInput_ } from "./index";

export default {
  title: "components/Input/Checkbox",
  component: CheckboxInput_,
  args: {
    label: "By checking this box you agree to our Terms and Conditions",
    value: true,
  },
  argTypes: {
    onChange: {
      action: "onChange",
    },
  },
};

export const Checkbox: ComponentStory<typeof CheckboxInput_> = args => {
  const [value, setValue] = useState(args.value);
  useEffect(() => setValue(args.value), [args.value]);

  return (
    <CheckboxInput_
      {...args}
      onChange={nextValue => {
        setValue(nextValue);
        args.onChange?.(nextValue);
      }}
      value={value}
    />
  );
};

Checkbox.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const element = canvas.getByText(args.label as string) as HTMLElement;
  await expect(element).toBeVisible();

  await userEvent.click(element);
  await expect(args.onChange).toHaveBeenCalled();
};
