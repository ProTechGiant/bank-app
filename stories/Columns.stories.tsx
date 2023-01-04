import { ComponentStory } from "@storybook/react";
import { Text } from "react-native";

import { Box } from "@/components/Box";
import { Column, Columns as ColumnsComponent } from "@/components/Columns";

export default {
  title: "Layout/Columns",
  argTypes: {
    space: {
      options: ["none", "xxxSmall", "xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge", "xxxLarge"],
      control: { type: "select" },
    },
  },
};

const Template: ComponentStory<typeof ColumnsComponent> = args => (
  <ColumnsComponent space={args.space}>
    <Column flex="1/3">
      <Box padding="medium" backgroundColor="bisque" width={100}>
        <Text>Box 1</Text>
      </Box>
    </Column>
    <Column flex="1/3">
      <Box padding="medium" backgroundColor="bisque" width={100}>
        <Text>Box 2</Text>
      </Box>
    </Column>
    <Column flex="1/3">
      <Box padding="medium" backgroundColor="bisque" width={100}>
        <Text>Box 3</Text>
      </Box>
    </Column>
  </ColumnsComponent>
);

export const Columns = Template.bind({});
