import { ComponentMeta, ComponentStory } from "@storybook/react";

import Typography from "../Typography";
import Accordion from ".";

export default {
  title: "components/Accordion",
  component: Accordion,
  args: {
    title: "Example accordion",
    children: (
      <Typography.Text color="neutralBase+10" size="footnote">
        Accordion Dropdown
      </Typography.Text>
    ),
  },
  argTypes: {
    title: {
      type: "string",
    },
    children: {
      type: "function",
    },
  },
} as ComponentMeta<typeof Accordion>;

export const Default: ComponentStory<typeof Accordion> = args => {
  return <Accordion {...args} />;
};
