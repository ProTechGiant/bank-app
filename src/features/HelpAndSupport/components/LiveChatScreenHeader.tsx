import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundSvgLTR from "../assets/BackgroundSvgLTR.svg";
import BackgroundSvgRTL from "../assets/BackgroundSvgRTL.svg";

interface LiveChatScreenHeaderProps {
  isHide: boolean;
  onBackPress: () => void;
}

export default function LiveChatScreenHeader({ isHide, onBackPress }: LiveChatScreenHeaderProps) {
  const { t } = useTranslation();
  const currentHeight = useSharedValue(isHide ? 90 : 259);
  const currentOpacity = useSharedValue(isHide ? 0 : 1);
  const isRTL = I18nManager.isRTL;

  useEffect(() => {
    currentHeight.value = isHide ? 90 : 259;
    currentOpacity.value = isHide ? 0 : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHide]);

  const animatedHeaderStyle = useAnimatedStyle(
    () => ({
      flex: 0,
      height: withTiming(currentHeight.value, { duration: 300 }),
      overflow: "hidden",
    }),
    [isHide]
  );

  const animatedBackgroundImageStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(currentOpacity.value, { duration: 300 }),
    }),
    [isHide]
  );

  const navHeaderContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  const titleContainer = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
    paddingVertical: 0,
  }));

  return (
    <React.Fragment>
      <Animated.View style={[styles.container, animatedHeaderStyle]}>
        <Animated.View style={[styles.backgroundImage, animatedBackgroundImageStyle]}>
          {isRTL ? <BackgroundSvgRTL /> : <BackgroundSvgLTR />}
        </Animated.View>
        <View style={navHeaderContainer}>
          {!isHide ? (
            <NavHeader onBackPress={onBackPress} showStatusBar={false} />
          ) : (
            <NavHeader
              onBackPress={onBackPress}
              title={t("HelpAndSupport.LiveChatScreen.headerTitle")}
              showStatusBar={false}
            />
          )}
        </View>
        <ContentContainer style={titleContainer}>
          <Typography.Text color="neutralBase+30" size="title1" weight="medium">
            {t("HelpAndSupport.LiveChatScreen.headerTitle")}
          </Typography.Text>
          <Stack direction="horizontal" gap="4p">
            <Typography.Text color="neutralBase+20" size="callout" weight="semiBold">
              {t("HelpAndSupport.LiveChatScreen.firstLineTitle")}
            </Typography.Text>
            <Typography.Text color="neutralBase+20" size="callout" weight="semiBold">
              {t("HelpAndSupport.LiveChatScreen.secondLineTitle")}
            </Typography.Text>
          </Stack>
        </ContentContainer>
      </Animated.View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
