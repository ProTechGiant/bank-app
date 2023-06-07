import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useState } from "react";

import { TextInput as TextInput_ } from "./TextInput";

export default {
  title: "components/Input/Text",
  component: TextInput_,
  args: {
    label: "Example input",
    placeholder: "Some placeholder text...",
    maxLength: 125,
    showCharacterCount: true,
  },
  argTypes: {
    variant: {
      type: {
        name: "enum",
        value: ["small", "simple"],
      },
      defaultValue: "simple",
    },
    showCharacterCount: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof TextInput_>;

export const Text: ComponentStory<typeof TextInput_> = args => {
  const [value, setValue] = useState("");

  return <TextInput_ {...args} onChangeText={setValue} testID="input-element" value={value} />;
};

Text.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByTestId("input-element") as HTMLInputElement;

  await expect(inputElem).toBeVisible();
  await waitFor(() => fireEvent.focus(inputElem));

  const inputText = "Typing some input...";
  await userEvent.type(inputElem, inputText, { delay: 150 });
  await expect(inputElem.value).toBe(inputText);
  await expect(canvas.getByText(`${inputText.length} / ${args.maxLength}`)).toBeVisible();
};
