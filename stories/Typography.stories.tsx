import { ComponentStory } from "@storybook/react";

import Typography from "@/components/Typography";

export default {
  title: "components/Typography",
};

const TemplateText: ComponentStory<typeof Typography.Text> = args => {
  return <Typography.Text {...args}>Some body text</Typography.Text>;
};

export const Text = TemplateText.bind({});
Text.args = { color: "primaryBase", size: "body", weight: "regular" };

const TemplateHeader: ComponentStory<typeof Typography.Header> = args => {
  return <Typography.Header {...args}>Hello World!</Typography.Header>;
};

export const Header = TemplateHeader.bind({});
Header.args = { color: "primaryBase", size: "large", weight: "regular" };
