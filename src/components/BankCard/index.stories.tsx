import { ComponentStory } from "@storybook/react";

import BankCard_ from "./index";

export default {
  title: "components/BankCard",
  component: BankCard_,
  args: {
    height: 200,
    variant: "standard",
  },
};

export const BankCard: ComponentStory<typeof BankCard_> = args => {
  return <BankCard_ {...args} />;
};
