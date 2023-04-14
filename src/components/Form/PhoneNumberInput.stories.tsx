import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useForm } from "react-hook-form";

import PhoneNumberInput_ from "./PhoneNumberInput";

export default {
  title: "components/Form/PhoneNumberInput",
  component: PhoneNumberInput_,
  args: {
    label: "Example input",
    placeholder: "Some placeholder text...",
    maxLength: 9,
    showCharacterCount: true,
  },
  argTypes: {
    control: {
      table: {
        disable: true,
      },
    },
    name: {
      table: {
        disable: true,
      },
    },
    showCharacterCount: {
      table: {
        disable: true,
      },
    },
  },
};

export const PhoneNumberInput: ComponentStory<typeof PhoneNumberInput_> = args => {
  const { control } = useForm();

  return <PhoneNumberInput_ {...args} control={control} name="example" />;
};

PhoneNumberInput.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByPlaceholderText(args.placeholder as string);

  await expect(inputElem).toBeVisible();
  await waitFor(() => fireEvent.focus(inputElem));

  const mobileNumber = "555123456";
  const maskedMobileNumber = "55 512 3456";
  await userEvent.type(inputElem, mobileNumber, { delay: 280 });
  await expect(inputElem.value).toBe(maskedMobileNumber);
};
