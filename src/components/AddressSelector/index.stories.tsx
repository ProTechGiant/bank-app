import { expect } from "@storybook/jest";
import { ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import AddressSelector_ from "./index";

export default {
  title: "components/AddressSelector",
  component: AddressSelector_,
  args: {
    label: "Label",
    addressLineOne: "Address line 1",
    addressLineTwo: "Address line 2",
    addressLineThree: "Address line 3",
    isSelected: true,
    isTemporary: false,
    testID: "address-selector",
  },
  argTypes: {
    endComponent: {
      options: ["radio", "chevron"],
      control: { type: "radio" },
    },
    testID: {
      table: {
        disable: true,
      },
    },
    onPress: {
      action: "onPress",
      table: {
        disable: true,
      },
    },
  },
};

export const AddressSelector: ComponentStory<typeof AddressSelector_> = args => {
  return <AddressSelector_ {...args} />;
};

AddressSelector.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const addressSelector = canvas.getByTestId(args.testID as string);
  await expect(addressSelector).toBeVisible();

  await userEvent.click(addressSelector);
  await expect(args.onPress).toBeCalled();
};
