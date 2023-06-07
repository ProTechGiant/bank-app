import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useEffect, useState } from "react";

import { DropdownInput as DropdownInput_ } from "./DropdownInput";

export default {
  title: "components/Input/Dropdown",
  component: DropdownInput_,
  argTypes: {
    isEditable: {
      type: "boolean",
    },
    label: {
      type: "string",
    },
    placeholder: {
      type: "string",
    },
  },
  args: {
    label: "Example dropdown",
  },
} as ComponentMeta<typeof DropdownInput_>;

export const Dropdown: ComponentStory<typeof DropdownInput_> = args => {
  const [value, setValue] = useState(args.value);

  useEffect(() => {
    setValue(args.value);
  }, [args.value]);

  return (
    <DropdownInput_
      {...args}
      onChange={setValue}
      options={[
        {
          label: "One",
          value: 1,
        },
        {
          label: "Two",
          value: 2,
        },
        {
          label: "Three",
          value: 3,
        },
      ]}
      value={value}
    />
  );
};
