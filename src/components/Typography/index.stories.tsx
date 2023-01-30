import { ComponentMeta, ComponentStory } from "@storybook/react";

import Typography from "@/components/Typography";
import * as theme from "@/theme/values";

export default {
  title: "design/Typography",
  component: Typography.Text,
  argTypes: {
    color: {
      options: Object.keys(theme.palette),
      control: "select",
    },
  },
} as ComponentMeta<typeof Typography.Text>;

export const Text: ComponentStory<typeof Typography.Text> = args => {
  return <Typography.Text {...args}>Text used in body</Typography.Text>;
};
Text.args = { color: "primaryBase", size: "body", weight: "regular" };
Text.argTypes = {
  size: { options: Object.keys(theme.typography.text.sizes), control: "select" },
  weight: { options: Object.keys(theme.typography.text.weights), control: "select" },
};

export const Header: ComponentStory<typeof Typography.Header> = args => {
  return <Typography.Header {...args}>Header text</Typography.Header>;
};
Header.args = { color: "primaryBase", size: "large", weight: "regular" };
Header.argTypes = {
  size: { options: Object.keys(theme.typography.header.sizes), control: "select" },
  weight: { options: Object.keys(theme.typography.header.weights), control: "select" },
};
