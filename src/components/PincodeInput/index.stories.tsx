import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { fireEvent, userEvent, waitFor, within } from "@storybook/testing-library";
import times from "lodash/times";
import { useState } from "react";

import PincodeInput_ from "./index";

export default {
  title: "components/PincodeInput",
  component: PincodeInput_,
  args: {
    isEditable: true,
    isError: false,
    length: 6,
  },
  argTypes: {
    isEditable: {
      type: "boolean",
    },
    isError: {
      type: "boolean",
    },
    onChangeText: {
      action: "onChangeText",
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof PincodeInput_>;

export const PincodeInput: ComponentStory<typeof PincodeInput_> = props => {
  const [currentValue, setCurrentValue] = useState("");

  const handleOnChangeText = (value: string) => {
    setCurrentValue(value);
    props.onChangeText?.(value);
  };

  return <PincodeInput_ {...props} onChangeText={handleOnChangeText} value={currentValue} />;
};

PincodeInput.play = async ({ args, canvasElement }) => {
  const inputText = times(args.length)
    .map(index => index)
    .join("");

  const canvas = within(canvasElement);
  const element = canvas.getByRole("button");

  await expect(element).toBeVisible();
  await waitFor(() => fireEvent.focus(element));

  await userEvent.type(element, inputText, { delay: 150 });
  await expect(args.onChangeText).toHaveBeenLastCalledWith(inputText);
};
