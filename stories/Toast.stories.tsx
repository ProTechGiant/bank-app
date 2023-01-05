import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Text } from "react-native";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";

export default {
  title: "components/Toast",
  component: Toast,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Toast>;

const TemplateStandardToast: ComponentStory<typeof Toast> = props => {
  return <Toast {...props} />;
};

export const StandardToast = TemplateStandardToast.bind({});
StandardToast.args = {
  variant: "compliment",
  borderPosition: "left",
  title: "lorem ipsum",
  content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
};

const TemplateCustomToast: ComponentStory<typeof Toast> = props => {
  return (
    <Toast {...props}>
      <Typography.Text color="primaryBase+30" size="caption1" weight="regular">
        To join Croatia, you must be over 18 and have an Absher profile. Register at
        <Typography.Text color="primaryBase+30" size="caption1" weight="bold">
          {" "}
          absher.sa
        </Typography.Text>{" "}
        before joining us
      </Typography.Text>
    </Toast>
  );
};

export const CustomToast = TemplateCustomToast.bind({});
CustomToast.args = {
  variant: "compliment",
  borderPosition: "left",
  children: <Text>strest</Text>,
};
