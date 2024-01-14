import React from "react";
import { I18nManager, Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { GoalGetterIconLTR, GoalGetterIconRTL } from "../assets/icons";
import PromotionalIllustration from "../assets/PromotionalIllustration.png";
import PromotionalIllustrationAR from "../assets/PromotionalIllustrationAr.png";
interface CardSectionProps {
  onPress: () => void;
  isReferFriend: boolean;
  title: string;
  description: string;
  buttonText: string;
  testID?: string;
}

export default function CardSection({
  onPress,
  isReferFriend,
  title,
  description,
  buttonText,
  testID,
}: CardSectionProps) {
  const isRTL = I18nManager.isRTL;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    backgroundColor: theme.palette["neutralBase+30"],
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
    marginHorizontal: theme.spacing["20p"],
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
    <Pressable onPress={onPress}>
      <View testID={testID} style={containerStyle}>
        <View style={contentContainerStyle}>
          <Typography.Text size="title3" weight="bold" color="neutralBase-60">
            {title}
          </Typography.Text>
          <View style={descriptionMarginTopStyle}>
            <Typography.Text size="callout" weight="regular" color="neutralBase-60">
              {description}
            </Typography.Text>
          </View>
          <View style={buttonStyle}>
            <Button
              testID={testID !== undefined ? `${testID}-InviteNowButton` : undefined}
              onPress={onPress}
              withBorderWidth={false}
              variant="quaternary">
              {buttonText}
            </Button>
          </View>
        </View>
        <View style={styles.iconBackGroundContainer}>
          {isReferFriend ? (
            isRTL ? (
              <Image source={PromotionalIllustrationAR} />
            ) : (
              <Image source={PromotionalIllustration} />
            )
          ) : isRTL ? (
            <GoalGetterIconRTL />
          ) : (
            <GoalGetterIconLTR />
          )}
        </View>
      </View>
    </Pressable>
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
