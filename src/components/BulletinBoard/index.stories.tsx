/* eslint-disable react-native/no-inline-styles */
import { ComponentStory } from "@storybook/react";
import { Text, View } from "react-native";

import { UserClockIcon } from "@/assets/icons";

import BulletinBoard_ from "./index";

const notifications = [
  {
    action_id: "1",
    action_title: "Title 1",
  },
  {
    action_id: "2",
    action_title: "Title 2",
  },
];

export default {
  title: "components/BulletinBoard",
  component: BulletinBoard_,
  args: {
    title: "Example board",
    iconStart: <UserClockIcon />,
    children: notifications.map(notification => (
      <View style={{ width: "100%" }}>
        <Text key={notification.action_id}>{notification.action_title}</Text>
      </View>
    )),
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    isExpanded: {
      control: "boolean",
    },
    iconStart: {
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
