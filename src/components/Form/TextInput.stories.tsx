import { ComponentStory } from "@storybook/react";
import { useForm } from "react-hook-form";

import TextInput_ from "./TextInput";

export default {
  title: "components/Form/Text",
  component: TextInput_,
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

const TemplateTextInput: ComponentStory<typeof TextInput_> = args => {
  const { control } = useForm();

  return <TextInput_ {...args} control={control} name="example" />;
};

export const Simple = TemplateTextInput.bind({});
export const Multiline = TemplateTextInput.bind({});
Multiline.args = { multiline: true };
