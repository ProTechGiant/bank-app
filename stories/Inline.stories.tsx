import { ComponentStory } from "@storybook/react";
import { Text } from "react-native";

import { Inline as InlineComponent } from "@/components/Inline";
import { Box } from "@/components/Box";

export default {
  title: "Layout/Inline",
  argTypes: {
    space: {
      options: ["none", "xxxSmall", "xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge", "xxxLarge"],
      control: { type: "select" },
    },
    xAlign: {
      options: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
      control: { type: "select" },
    },
  },
};

const Template: ComponentStory<typeof InlineComponent> = args => (
  <InlineComponent space={args.space} xAlign={args.xAlign}>
    <Box padding="medium" backgroundColor="bisque" width={100}>
      <Text>Box 1</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque" width={100}>
      <Text>Box 2</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque" width={100}>
      <Text>Box 3</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque" width={100}>
      <Text>Box 4</Text>
    </Box>
  </InlineComponent>
);

export const Inline = Template.bind({});
