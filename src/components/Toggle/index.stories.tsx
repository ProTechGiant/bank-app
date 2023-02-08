import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useEffect, useState } from "react";

import Toggle_ from "./index";

export default {
  title: "components/Toggle",
  component: Toggle_,
  args: {
    value: false,
    testID: "toggle",
  },
  argTypes: {
    onPress: {
      action: "onPress",
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
};

export const Toggle: ComponentStory<typeof Toggle_> = args => {
  const [currentValue, setCurrentValue] = useState(args.value);

  useEffect(() => {
    setCurrentValue(args.value);
  }, [args.value]);

  const handleOnPress = () => {
    setCurrentValue(c => !c);
    args.onPress();
  };

  return <Toggle_ {...args} onPress={handleOnPress} value={currentValue} />;
};

Toggle.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const toggleElement = canvas.getByTestId(args.testID as string);

  await expect(toggleElement).toBeVisible();
  await userEvent.click(toggleElement);
  await expect(args.onPress).toBeCalled();
};
