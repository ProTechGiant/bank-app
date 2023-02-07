import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useForm } from "react-hook-form";

import CurrencyInput_ from "./CurrencyInput";

export default {
  title: "components/Form/Currency",
  component: CurrencyInput_,
  args: {
    label: "Example input",
    placeholder: "0 SAR",
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
  },
};

export const Currency: ComponentStory<typeof CurrencyInput_> = args => {
  const { control } = useForm({
    defaultValues: {
      example: null,
    },
  });

  return <CurrencyInput_ {...args} control={control} name="example" />;
};

Currency.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByPlaceholderText(args.placeholder as string) as HTMLInputElement;
  await expect(inputElem).toBeVisible();

  // Add some input into the field
  await waitFor(() => fireEvent.focus(inputElem));
  const inputText = "5000000.90";
  const expectedText = Number(inputText).toLocaleString("en-US", { style: "decimal" }) + "0";
  await userEvent.type(inputElem, inputText, { delay: 150 });
  await expect(inputElem.value).toBe(expectedText);

  // Cannot write a non-number
  await userEvent.type(inputElem, "abcde", { delay: 150 });
  await expect(inputElem.value).toBe(expectedText);
};
