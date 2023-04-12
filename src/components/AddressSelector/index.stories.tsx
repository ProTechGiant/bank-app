import { ComponentStory } from "@storybook/react";

import AddressSelector_ from "./index";

export default {
  title: "components/AddressSelector",
  component: AddressSelector_,
  args: {
    id: "1",
    label: "Label",
    addressLineOne: "PrimaryAddress",
    isSelected: true,
    isTemporary: false,
  },
  argTypes: {
    label: {
      table: {
        disable: false,
      },
    },
    addressLineOne: {
      table: {
        disable: false,
      },
    },
    addressLineTwo: {
      table: {
        disable: false,
      },
    },
    addressLineThree: {
      table: {
        disable: false,
      },
    },
    isSelected: {
      table: {
        disable: false,
      },
    },
    isTemporary: {
      table: {
        disable: false,
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
