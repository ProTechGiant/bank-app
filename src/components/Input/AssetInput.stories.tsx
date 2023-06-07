import { ComponentStory } from "@storybook/react";

import { AssetInput as AssetInput_ } from "./index";

export default {
  title: "components/Input/Asset",
  component: AssetInput_,
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
  },
};

export const Asset: ComponentStory<typeof AssetInput_> = args => {
  return <AssetInput_ {...args} />;
};
