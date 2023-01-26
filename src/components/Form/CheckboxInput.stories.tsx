import { ComponentStory } from "@storybook/react";
import { useForm } from "react-hook-form";

import CheckboxInput_ from "./CheckboxInput";

export default {
  title: "components/Form/Checkbox",
  component: CheckboxInput_,
  args: {
    label: "Example input",
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
  },
};

export const Checkbox: ComponentStory<typeof CheckboxInput_> = args => {
  const { control } = useForm();

  return <CheckboxInput_ {...args} control={control} name="example" />;
};
