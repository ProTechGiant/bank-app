import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useEffect, useState } from "react";

import { CurrencyInput as CurrencyInput_ } from "./CurrencyInput";

export default {
  title: "components/Input/Currency",
  component: CurrencyInput_,
  args: {
    label: "Example input",
    placeholder: "0 SAR",
  },
};

export const Currency: ComponentStory<typeof CurrencyInput_> = args => {
  const [value, setValue] = useState(args.value);
  useEffect(() => setValue(args.value), [args.value]);

  return <CurrencyInput_ {...args} onChange={v => setValue(v)} testID="input-element" value={value} />;
};

Currency.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByTestId("input-element") as HTMLInputElement;
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
