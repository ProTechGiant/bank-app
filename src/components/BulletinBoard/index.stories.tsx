import { ComponentStory } from "@storybook/react";

import BulletinBoard_ from "./index";

export default {
  title: "components/BulletinBoard",
  component: BulletinBoard_,
  args: {
    title: "Example board",
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    data: {
      table: {
        disable: true,
      },
    },
    isExpanded: {
      table: {
        disable: true,
      },
    },
    onExpandPress: {
      table: {
        disable: true,
      },
    },
  },
};

export const BulletinBoard: ComponentStory<typeof BulletinBoard_> = args => {
  return <BulletinBoard_ {...args} />;
};
