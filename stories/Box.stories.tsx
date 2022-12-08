import { ComponentStory } from "@storybook/react";
import { Text } from "react-native";

import { Box as BoxComponent } from "@/components/Box";

export default {
  title: "Layout/Box",
  argTypes: {
    backgroundColor: {
      options: ["none", "bisque"],
      control: { type: "select" },
    },
    padding: {
      options: ["none", "xxxSmall", "xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge", "xxxLarge"],
      control: { type: "select" },
    },
    width: {
      options: [100, 200, 500, "25%", "50%", "100%"],
      control: { type: "select" },
    },
  },
};

const Template: ComponentStory<typeof BoxComponent> = args => (
  <BoxComponent {...args}>
    <Text>Box</Text>
  </BoxComponent>
);

export const Stack = Template.bind({});
