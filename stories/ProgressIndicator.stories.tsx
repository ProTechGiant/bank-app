import { ComponentMeta, ComponentStory } from "@storybook/react";
import { View } from "react-native";

import ProgressIndicator from "@/components/ProgressIndicator";

export default {
  title: "components/ProgressIndicator",
  component: ProgressIndicator,
} as ComponentMeta<typeof ProgressIndicator>;

const Template: ComponentStory<typeof ProgressIndicator> = props => {
  return (
    <View style={{ width: "80%" }}>
      <ProgressIndicator {...props} />
    </View>
  );
};

export const Default = Template.bind({});
Default.args = {
  currentStep: 2,
  totalStep: 6,
};
