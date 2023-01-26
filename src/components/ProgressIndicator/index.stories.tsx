import { ComponentMeta, ComponentStory } from "@storybook/react";
import { View } from "react-native";

import ProgressIndicator_ from "@/components/ProgressIndicator";

export default {
  title: "components/ProgressIndicator",
  component: ProgressIndicator_,
} as ComponentMeta<typeof ProgressIndicator_>;

export const ProgressIndicator: ComponentStory<typeof ProgressIndicator_> = props => (
  <View style={{ width: "100%" }}>
    <ProgressIndicator_ {...props} />
  </View>
);
ProgressIndicator.args = { currentStep: 2, totalStep: 6 };
