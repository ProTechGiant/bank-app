import { ComponentMeta, ComponentStory } from "@storybook/react";

import { InfoFilledCircleIcon } from "@/assets/icons";
import Banner from "@/components/Banner";

export default {
  title: "components/Banner",
  component: Banner,
  argTypes: {
    backgroundColor: {
      table: {
        disable: true,
      },
    },
    icon: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Banner>;

const TemplateBanner: ComponentStory<typeof Banner> = args => {
  return <Banner {...args} />;
};

const commonArgs = {
  message: "paragraph",
  icon: <InfoFilledCircleIcon />,
  label: "Label",
  onClear: () => console.log("clear"),
};

export const AccentHighPriority = TemplateBanner.bind({});

AccentHighPriority.args = {
  backgroundColor: "tintBase",
  ...commonArgs,
};

export const AccentLowPriority = TemplateBanner.bind({});

AccentLowPriority.args = {
  backgroundColor: "tintBase-30",
  ...commonArgs,
};

export const PositiveHighPriority = TemplateBanner.bind({});

PositiveHighPriority.args = {
  backgroundColor: "successBase+10",
  ...commonArgs,
};

export const PositiveLowPriority = TemplateBanner.bind({});

PositiveLowPriority.args = {
  backgroundColor: "successBase-30",
  ...commonArgs,
};

export const WarningHighPriority = TemplateBanner.bind({});

WarningHighPriority.args = {
  backgroundColor: "warningBase",
  ...commonArgs,
};

export const WarningLowPriority = TemplateBanner.bind({});

WarningLowPriority.args = {
  backgroundColor: "warningBase-30",
  ...commonArgs,
};

export const ErrorHighPriority = TemplateBanner.bind({});

ErrorHighPriority.args = {
  backgroundColor: "errorBase",
  ...commonArgs,
};

export const ErrorLowPriority = TemplateBanner.bind({});

ErrorLowPriority.args = {
  backgroundColor: "errorBase-40",
  ...commonArgs,
};
