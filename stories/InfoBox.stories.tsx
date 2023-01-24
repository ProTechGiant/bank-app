import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Text } from "react-native";

import InfoBox from "@/components/InfoBox";
import Typography from "@/components/Typography";

export default {
  title: "components/InfoBox",
  component: InfoBox,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof InfoBox>;

const TemplateStandardInfoBox: ComponentStory<typeof InfoBox> = props => {
  return <InfoBox {...props} />;
};

export const StandardInfoBox = TemplateStandardInfoBox.bind({});
StandardInfoBox.args = {
  variant: "compliment",
  borderPosition: "start",
  title: "lorem ipsum",
  children:
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
};

const TemplateCustomInfoBox: ComponentStory<typeof InfoBox> = props => {
  return (
    <InfoBox {...props}>
      <Typography.Text color="primaryBase+30" size="caption1" weight="regular">
        To join Croatia, you must be over 18 and have an Absher profile. Register at
        <Typography.Text color="primaryBase+30" size="caption1" weight="bold">
          {" "}
          absher.sa
        </Typography.Text>{" "}
        before joining us
      </Typography.Text>
    </InfoBox>
  );
};

export const CustomInfoBox = TemplateCustomInfoBox.bind({});
CustomInfoBox.args = {
  variant: "compliment",
  borderPosition: "start",
  children: <Text>strest</Text>,
};
