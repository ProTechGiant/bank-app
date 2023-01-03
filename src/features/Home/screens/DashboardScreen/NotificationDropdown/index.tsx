import { useState } from "react";
import { Dimensions } from "react-native";
import { spacing } from "@/theme/values";

import Carousel from "@/components/Carousel";
import Dropdown from "@/components/Dropdown";
import NotificationsTitle from "./NotificationsTitle";
import { useFetchActions } from "./use-fetch-actions";
import SlideContent from "./SlideContent";

export interface Notification {
  action_id: string;
  action_type: string;
  action_status: string;
  action_title: string;
  action_message: string;
  action_link: string;
  action_button_text: string;
}

export default function NotificationDropdown() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { pendingNotifications } = useFetchActions();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  if (!pendingNotifications?.length) return <></>;

  return (
    <Dropdown
      title={
        <NotificationsTitle
          length={pendingNotifications.length}
          dropdownVisible={dropdownVisible}
          onPress={toggleDropdown}
        />
      }
      dropdownVisible={dropdownVisible}
      content={
        <Carousel
          data={pendingNotifications}
          onPressSlide={toggleDropdown}
          Slide={SlideContent}
          width={Dimensions.get("screen").width - spacing.medium * 2}
          pagination={true}
        />
      }
    />
  );
}
