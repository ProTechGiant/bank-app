import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { Alert } from "react-native";

import ProgressIndicator from "../ProgressIndicator";
import NavHeader_ from "./index";

export default {
  title: "components/NavHeader",
  component: NavHeader_,
  args: {
    testID: "NavHeader",
    title: "Header text",
    end: "close",
  },
  argTypes: {
    color: {
      table: {
        disable: true,
      },
    },
    onBackPress: {
      action: "onBackPress",
      table: {
        disable: true,
      },
    },
    testID: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof NavHeader_>;

export const Default: ComponentStory<typeof NavHeader_> = args => {
  return <NavHeader_ {...args} />;
};

Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const backButton = canvas.getByTestId(`${args.testID}-->BackButton`);

  await expect(backButton).toBeVisible();
  await userEvent.click(backButton);
  await expect(args.onBackPress).toBeCalled();
};

export const TextEndButton: ComponentStory<typeof NavHeader_> = args => {
  return (
    <NavHeader_ {...args} end={<NavHeader_.TextEndButton text="Goodbye" onPress={() => Alert.alert("CLikced")} />} />
  );
};

export const WithChildren: ComponentStory<typeof NavHeader_> = args => {
  return (
    <NavHeader_ {...args}>
      <ProgressIndicator currentStep={3} totalStep={5} />
    </NavHeader_>
  );
};
