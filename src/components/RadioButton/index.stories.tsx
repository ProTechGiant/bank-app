import { ComponentStory } from "@storybook/react";
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
};

Default.argTypes = {
  label: {
    type: "string",
  },
  onPress: {
    action: "onPress",
    table: {
      disabled: true,
    },
  },
  isSelected: {
    type: "boolean",
  },
};

export const Grouped: ComponentStory<typeof RadioButtonGroup_> = props => {
  const [value, setValue] = useState(props.value ?? 1);

  return (
    <RadioButtonGroup_ {...props} onPress={value_ => setValue(value_)} value={value}>
      <RadioButton_ label="Hello World #1" value={1} />
      <RadioButton_ label="Hello World #2" value={2} />
      <RadioButton_ label="Hello World #3" value={3} />
    </RadioButtonGroup_>
  );
};
