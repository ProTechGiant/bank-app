import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { View } from "react-native";

import Button from "@/components/Button";
import NotificationModal_ from "@/components/NotificationModal";

export default {
  title: "components/NotificationModal",
  component: NotificationModal_,
  args: {
    testID: "NotificationModal",
    title: "This is a title",
    message: "This is a message",
    isVisible: true,
    buttons: {
      primary: <Button testID="primaryButton">Continue</Button>,
      secondary: <Button testID="secondaryButton">Cancel</Button>,
    },
    variant: "success",
  },
  argTypes: {
    icon: {
      table: {
        disable: true,
      },
    },
    onClose: {
      action: "onClose",
      table: {
        disable: true,
      },
    },
    buttons: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof NotificationModal_>;

export const NotificationModal: ComponentStory<typeof NotificationModal_> = props => {
  return (
    <View style={{ width: "100%" }}>
      <NotificationModal_ {...props} />
    </View>
  );
};

NotificationModal.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText(args.title)).toBeVisible();
  await expect(canvas.getByText(args.message)).toBeVisible();
  await expect(canvas.getByTestId("primaryButton")).toBeVisible();
  await expect(canvas.getByTestId("secondaryButton")).toBeVisible();
};
