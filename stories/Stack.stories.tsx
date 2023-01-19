import { ComponentStory } from "@storybook/react";
import { Text, View } from "react-native";

import Stack from "@/components/Stack";

export default {
  component: Stack,
  title: "components/Stack",
};

const TemplateStack: ComponentStory<typeof Stack> = props => (
  <Stack {...props}>
    <View>
      <Text>Box 1</Text>
    </View>
    <View>
      <Text>Box 2</Text>
    </View>
    <View>
      <Text>Box 3</Text>
    </View>
    <View>
      <Text>Box 4</Text>
    </View>
  </Stack>
);

export const Default = TemplateStack.bind({});
