import { ComponentStory } from "@storybook/react";

import Tag_ from "./index";

export default {
  title: "components/Tag",
  component: Tag_,
  args: {
    title: "Content",
    variant: "blue",
  },
  argTypes: {},
};

export const Tag: ComponentStory<typeof Tag_> = args => {
  return <Tag_ {...args} />;
};
