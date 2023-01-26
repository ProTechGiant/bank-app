import { ComponentStory } from "@storybook/react";
import { View } from "react-native";

import Stack from "@/components/Stack";

import Typography from "../Typography";

export default {
  component: Stack,
  title: "components/Stack",
  args: {
    gap: "regular",
  },
  argTypes: {
    direction: {
      table: {
        disable: true,
      },
    },
  },
};

const TemplateStack: ComponentStory<typeof Stack> = props => (
  <Stack {...props}>
    {times(5).map(index => (
      <View key={index}>
        <Typography.Text>Element {index + 1}</Typography.Text>
      </View>
    ))}
  </Stack>
);

export const HorizontalStack = TemplateStack.bind({});
HorizontalStack.args = { direction: "horizontal" };

export const VerticalStack = TemplateStack.bind({});
VerticalStack.args = { direction: "vertical" };

function times(i: number) {
  return [...new Array(i).keys()];
}
