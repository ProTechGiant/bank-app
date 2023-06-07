import { ComponentMeta, ComponentStory } from "@storybook/react";

import Typography from "../Typography";
import Accordion_ from ".";

export default {
  title: "components/Accordion",
  component: Accordion_,
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
} as ComponentMeta<typeof Accordion_>;

export const Accordion: ComponentStory<typeof Accordion_> = args => {
  return <Accordion_ {...args} />;
};
