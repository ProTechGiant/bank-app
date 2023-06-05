import { ComponentStory } from "@storybook/react";

import { AccessTimeIcon } from "@/assets/icons";

import LinkList_ from "./LinkList";

export default {
  title: "components/LinkList",
  component: LinkList_,
  args: {
    children: "Link text",
    linkTextEnd: "3",
    icon: <AccessTimeIcon />,
  },
  argTypes: {
    children: {
      type: "string",
    },
    onPress: {
      action: "onPress",
      table: {
        disable: true,
      },
    },
  },
};

export const Link: ComponentStory<typeof LinkList_> = args => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <LinkList_ onPress={() => {}} icon={args.icon} linkTextEnd={args.linkTextEnd}>
      {args.children}
    </LinkList_>
  );
};
