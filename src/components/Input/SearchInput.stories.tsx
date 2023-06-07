import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import { useState } from "react";

import { SearchInput as SearchInput_ } from "./index";

export default {
  title: "components/Input/Search",
  component: SearchInput_,
  args: {
    clearText: "Clear",
    placeholder: "Some placeholder text...",
  },
  argTypes: {
    onClear: {
      action: "onClear",
      table: {
        disable: true,
      },
    },
    onChangeText: {
      action: "onChangeText",
      table: {
        disable: true,
      },
    },
  },
};

export const Search: ComponentStory<typeof SearchInput_> = args => {
  const [value, setValue] = useState("");

  return (
    <SearchInput_
      {...args}
      onClear={() => {
        setValue("");
        args.onClear?.();
      }}
      onSearch={setValue}
      value={value}
    />
  );
};

Search.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const inputElem = canvas.getByPlaceholderText(args.placeholder as string);

  await expect(inputElem).toBeVisible();
  await waitFor(() => fireEvent.focus(inputElem));

  const inputText = "Typing some input...";
  await userEvent.type(inputElem, inputText, { delay: 150 });
  await expect(inputElem.value).toBe(inputText);

  await userEvent.click(canvas.getByText(args.clearText));
  await expect(args.onClear).toHaveBeenCalled();
};
