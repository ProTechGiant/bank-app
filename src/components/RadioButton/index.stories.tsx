import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useState } from "react";

import RadioButton_ from "./RadioButton";
import RadioButtonGroup_ from "./RadioButtonGroup";

export default {
  title: "components/RadioButton",
};

export const Default: ComponentStory<typeof RadioButton_> = props => {
  return <RadioButton_ {...props} />;
};

Default.args = {
  label: "Hello World",
  isSelected: true,
  disabled: false,
  testID: "radio",
};

Default.argTypes = {
  label: {
    type: "string",
  },
  onPress: {
    action: "onPress",
    table: {
      disable: true,
    },
  },
  testID: {
    table: {
      disable: true,
    },
  },
  isSelected: {
    type: "boolean",
  },
};

Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const radio = canvas.getByTestId(args.testID as string);
  await expect(radio).toBeVisible();

  if (!args.disabled) {
    await userEvent.click(radio);
    await expect(args.onPress).toBeCalled();
  }
};

export const Grouped: ComponentStory<typeof RadioButtonGroup_> = props => {
  const [value, setValue] = useState(props.value ?? 1);

  return (
    <RadioButtonGroup_ {...props} onPress={value_ => setValue(value_)} value={value}>
      <RadioButton_ label="Hello World #1" value={1} testID="radio-1" />
      <RadioButton_ label="Hello World #2" value={2} testID="radio-2" />
      <RadioButton_ label="Hello World #3" value={3} testID="radio-3" />
    </RadioButtonGroup_>
  );
};

Grouped.args = {
  value: 1,
  testID: "radio-group",
};

Grouped.argTypes = {
  children: {
    table: {
      disable: true,
    },
  },
  testID: {
    table: {
      disable: true,
    },
  },
  onPress: {
    action: "onPress",
    table: {
      disable: true,
    },
  },
};

Grouped.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const radio1 = canvas.getByTestId("radio-1");
  await expect(radio1).toBeVisible();
  const radio2 = canvas.getByTestId("radio-2");
  await expect(radio2).toBeVisible();
  const radio3 = canvas.getByTestId("radio-3");
  await expect(radio3).toBeVisible();
};
