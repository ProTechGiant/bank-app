import { ComponentMeta, ComponentStory } from "@storybook/react";

import Button from "@/components/Button";

export default {
  title: "components/Button",
  component: Button,
  argTypes: {
    iconLeft: {
      table: {
        disable: true,
      },
    },
    iconRight: {
      table: {
        disable: true,
      },
    },
    onPress: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Button>;

const TemplateButton: ComponentStory<typeof Button> = props => {
  return <Button {...props}>Hello World!</Button>;
};

export const Default = TemplateButton.bind({});
Default.args = { variant: "primary" };
