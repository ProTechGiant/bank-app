import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { View } from "react-native";

import Button from "@/components/Button";
import NotificationModal_ from "@/components/NotificationModal";

export default {
  title: "components/NotificationModal",
  component: NotificationModal_,
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
    primaryButton: {
      table: {
        disable: true,
      },
    },
    secondaryButton: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof NotificationModal_>;

export const NotificationModal: ComponentStory<typeof NotificationModal_> = props => (
  <View style={{ width: "100%" }}>
    <NotificationModal_ {...props} />
  </View>
);

NotificationModal.args = {
  testID: "NotificationModal",
  title: "This is title",
  message: "This is message",
  isVisible: true,
  primaryButton: <Button block>Continue</Button>,
  secondaryButton: <Button variant="tertiary">Cancel</Button>,
};

NotificationModal.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  const notificationModalElement = canvas.getByTestId(args.testID as string);

  await expect(notificationModalElement).toBeVisible();
};
