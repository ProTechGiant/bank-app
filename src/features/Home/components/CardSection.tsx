import React from "react";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { GoalGetterIconLTR, GoalGetterIconRTL, ReferFriendIconLTR, ReferFriendIconRTL } from "../assets/icon";

interface CardSectionProps {
  onPress: () => void;
  isReferFriend: boolean;
  title: string;
  description: string;
  buttonText: string;
}

export default function CardSection({ onPress, isReferFriend, title, description, buttonText }: CardSectionProps) {
  const isRTL = I18nManager.isRTL;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    marginBottom: theme.spacing["32p"],
    borderRadius: theme.radii.small,
    paddingBottom: theme.spacing["8p"],
    borderColor: theme.palette.supportBase,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    maxWidth: "60%",
    marginTop: theme.spacing["24p"],
    flexGrow: 1,
    marginHorizontal: theme.spacing["12p"],
  }));

  const descriptionMarginTopStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["12p"],
    marginHorizontal: theme.spacing["12p"],
    right: theme.spacing["16p"],
    maxWidth: "70%",
  }));

  return (
    <View style={containerStyle}>
      <View style={contentContainerStyle}>
        <Typography.Text size="title3" weight="bold">
          {title}
        </Typography.Text>
        <View style={descriptionMarginTopStyle}>
          <Typography.Text size="callout" weight="regular">
            {description}
          </Typography.Text>
        </View>
        <View style={buttonStyle}>
          <Button onPress={onPress}>{buttonText}</Button>
        </View>
      </View>
      <View style={styles.iconBackGroundContainer}>
        {isReferFriend ? (
          isRTL ? (
            <ReferFriendIconRTL />
          ) : (
            <ReferFriendIconLTR />
          )
        ) : isRTL ? (
          <GoalGetterIconRTL />
        ) : (
          <GoalGetterIconLTR />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBackGroundContainer: {
    flex: 1,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: -1,
  },
});
