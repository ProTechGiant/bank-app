import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useEffect, useState } from "react";

import { PhoneNumberInput as PhoneNumberInput_ } from "./PhoneNumberInput";

export default {
  title: "components/Input/PhoneNumber",
  component: PhoneNumberInput_,
  args: {
    label: "Example input",
  },
  argTypes: {
    onChangeText: {
      action: "onChangeText",
      table: {
        disable: true,
      },
    },
  },
};

export const PhoneNumber: ComponentStory<typeof PhoneNumberInput_> = args => {
  const [value, setValue] = useState(args.value);
  useEffect(() => setValue(args.value), [args.value]);

  const handleOnChangeText = (next: string) => {
    setValue(next);
    args.onChangeText?.(next);
  };

  return <PhoneNumberInput_ {...args} onChangeText={handleOnChangeText} testID="input-element" value={value} />;
};

PhoneNumber.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByTestId("input-element");

  await expect(inputElem).toBeDefined();
  await waitFor(() => fireEvent.focus(inputElem));

  const mobileNumber = "5555123456";
  const maskedMobileNumber = "55 512 3456";
  await Promise.resolve();
  await userEvent.type(inputElem, mobileNumber, { delay: 500 });
  await expect(inputElem.value).toBe(maskedMobileNumber);
};
