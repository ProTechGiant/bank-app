import { ComponentStory } from "@storybook/react";
import { Text } from "react-native";

import { Stack as StackComponent } from "@/components/Stack";
import { Box } from "@/components/Box";

export default {
  title: "Layout/Stack",
  argTypes: {
    space: {
      options: ["none", "xxxSmall", "xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge", "xxxLarge"],
      control: { type: "select" },
    },
    xAlign: {
      options: ["flex-start", "center", "flex-end"],
      control: { type: "select" },
    },
  },
};

const Template: ComponentStory<typeof StackComponent> = args => (
  <StackComponent space={args.space} xAlign={args.xAlign}>
    <Box padding="medium" backgroundColor="bisque">
      <Text>Box 1</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque">
      <Text>Box 2</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque">
      <Text>Box 3</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque">
      <Text>Box 4</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque" width={200}>
      <Text>Box 5 (width 200px)</Text>
    </Box>
    <Box padding="medium" backgroundColor="bisque" width={200}>
      <Text>Box 6 (width 200px)</Text>
    </Box>
  </StackComponent>
);

export const Stack = Template.bind({});
