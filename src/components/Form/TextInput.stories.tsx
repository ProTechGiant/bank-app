import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useForm } from "react-hook-form";

import TextInput_ from "./TextInput";

export default {
  title: "components/Form/Text",
  component: TextInput_,
  args: {
    label: "Example input",
    placeholder: "Some placeholder text...",
    maxLength: 125,
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

export const Text: ComponentStory<typeof TextInput_> = args => {
  const { control } = useForm({
    defaultValues: {
      example: null,
    },
  });

  return <TextInput_ {...args} control={control} name="example" />;
};

Text.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByPlaceholderText(args.placeholder as string);

  await expect(inputElem).toBeVisible();
  await waitFor(() => fireEvent.focus(inputElem));

  const inputText = "Typing some input...";
  await userEvent.type(inputElem, inputText, { delay: 150 });
  await expect(inputElem.value).toBe(inputText);
  await expect(canvas.getByText(`${inputText.length} / ${args.maxLength}`)).toBeVisible();
};
