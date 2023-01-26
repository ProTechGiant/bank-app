import { ComponentMeta, ComponentStory } from "@storybook/react";

import InfoBox from "@/components/InfoBox";
import Typography from "@/components/Typography";

export default {
  title: "components/InfoBox",
  component: InfoBox,
  args: {
    variant: "compliment",
    borderPosition: "start",
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    title: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof InfoBox>;

const TemplateInfoBox: ComponentStory<typeof InfoBox> = props => {
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

export const DefaultInfoBox = TemplateInfoBox.bind({});
export const InfoBoxWithHeader = TemplateInfoBox.bind({});
InfoBoxWithHeader.args = { title: "Hello World!" };
