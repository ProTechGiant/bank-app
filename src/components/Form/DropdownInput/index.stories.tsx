import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useForm } from "react-hook-form";

import DropdownInput_ from "./index";

export default {
  title: "components/Form/Dropdown",
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
  const { control } = useForm();

  return (
    <DropdownInput_
      {...args}
      control={control}
      name="dropdown"
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
    />
  );
};
