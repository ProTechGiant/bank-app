import { ComponentStory } from "@storybook/react";

import Chip_ from "./index";

export default {
  title: "components/Chip",
  component: Chip_,
  args: {
    title: "Content",
    isClosable: true,
    isEnabled: false,
  },
  argTypes: {
    onPress: {
      action: "onPress",
      table: {
        disable: true,
      },
    },
  },
};

export const Chip: ComponentStory<typeof Chip_> = args => {
  return <Chip_ {...args} />;
};
