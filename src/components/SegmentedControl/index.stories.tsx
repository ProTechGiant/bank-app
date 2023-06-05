import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useEffect, useState } from "react";

import SegmentedControl_ from "./index";

export default {
  title: "components/SegmentedControl",
  args: {
    value: "item-1",
  },
  argTypes: {
    onPress: {
      action: "onPress",
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof SegmentedControl_>;

export const SegmentedControl: ComponentStory<typeof SegmentedControl_> = props => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <SegmentedControl_
      {...props}
      onPress={value_ => {
        setValue(value_);
        props.onPress(value_);
      }}
      value={value}>
      <SegmentedControl_.Item value="item-1">Item #1</SegmentedControl_.Item>
      <SegmentedControl_.Item value="item-2">Item #2</SegmentedControl_.Item>
      <SegmentedControl_.Item value="item-3">Item #3</SegmentedControl_.Item>
    </SegmentedControl_>
  );
};
