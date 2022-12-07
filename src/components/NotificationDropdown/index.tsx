import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { notificationData } from "@/mocks/notificationData";
import { palette, radii, spacing } from "@/theme/values";

import Carousel from "../Carousel";
import Dropdown from "../Dropdown";
import NotificationsTitle from "./notificationsTitle";
import SlideContent from "./slideContent";

export default function NotificationDropdown() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const pendingNotifications = notificationData.filter(d => d.action_status === "pending");

  if (!pendingNotifications?.length) return <></>;

  return (
    <Dropdown
      Title={<NotificationsTitle length={2} dropdownVisible={dropdownVisible} onPress={toggleDropdown} />}
      dropdownVisible={dropdownVisible}
      Content={
        <Carousel
          data={pendingNotifications}
          onPressSlide={toggleDropdown}
          Slide={SlideContent}
          width={Dimensions.get("screen").width - spacing.medium * 2}
        />
      }
    />
  );
}
