import { ComponentStory } from "@storybook/react";
import times from "lodash/times";
import { StyleSheet, View } from "react-native";

import Stack from "@/components/Stack";

import Typography from "../Typography";

export default {
  component: Stack,
  title: "components/Stack",
  args: {
    align: "flex-start",
    gap: "16p",
    justify: "center",
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
  <View style={styles.container}>
    <Stack {...props}>
      {times(3).map(index => (
        <View key={index} style={styles.item}>
          <Typography.Text>Item {index + 1}</Typography.Text>
        </View>
      ))}
    </Stack>
  </View>
);

export const HorizontalStack = TemplateStack.bind({});
HorizontalStack.args = { direction: "horizontal" };

export const VerticalStack = TemplateStack.bind({});
VerticalStack.args = { direction: "vertical" };

const styles = StyleSheet.create({
  container: {
    borderColor: "#1EA7FD",
    borderStyle: "dotted",
    borderWidth: 2,
    padding: 15,
    width: "100%",
  },
  item: {
    borderColor: "#1EA7FD",
    borderStyle: "dotted",
    borderWidth: 1,
    padding: 10,
  },
});
