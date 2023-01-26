import { ComponentStory } from "@storybook/react";

import Typography from "@/components/Typography";

export default {
  title: "components/Typography",
  component: Typography.Text,
};

export const Text: ComponentStory<typeof Typography.Text> = args => {
  return <Typography.Text {...args}>Text used in body</Typography.Text>;
};
Text.args = { color: "primaryBase", size: "body", weight: "regular" };

export const Header: ComponentStory<typeof Typography.Header> = args => {
  return <Typography.Header {...args}>Header text</Typography.Header>;
};
Header.args = { color: "primaryBase", size: "large", weight: "regular" };
