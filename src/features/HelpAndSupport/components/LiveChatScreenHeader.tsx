import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundBottomSvg from "../assets/background-bottom.svg";
import BackgroundLeftBottomSvg from "../assets/background-left-bottom.svg";
import BackgroundRightSvg from "../assets/background-right.svg";
import BackgroundTopLeftSvg from "../assets/background-top-left.svg";

export default function LiveChatScreenHeader({ isHide }: { isHide: boolean }) {
  const { t } = useTranslation();
  const currentHeight = useSharedValue(isHide ? 90 : 259);
  const currentOpacity = useSharedValue(isHide ? 0 : 1);

  useEffect(() => {
    currentHeight.value = isHide ? 90 : 259;
    currentOpacity.value = isHide ? 0 : 1;
  }, [isHide]);

  const animatedHeaderStyle = useAnimatedStyle(
    () => ({
      flex: 0,
      height: withTiming(currentHeight.value, { duration: 1000 }),
      overflow: "hidden",
    }),
    [isHide]
  );

  const animatedBackgroundImageStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(currentOpacity.value, { duration: 1000 }),
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
        <StatusBar translucent={true} backgroundColor="transparent" />
        <Animated.View style={[styles.backgroundImage, animatedBackgroundImageStyle]}>
          <View style={styles.backgroundLeftTop}>
            <BackgroundTopLeftSvg />
          </View>
          <View style={styles.backgroundLeftBottom}>
            <BackgroundLeftBottomSvg />
          </View>
          <View style={styles.backgroundRight}>
            <BackgroundRightSvg />
          </View>
          <View style={styles.backgroundBottom}>
            <BackgroundBottomSvg style={styles.backgroundBottom} />
          </View>
        </Animated.View>
        <View style={navHeaderContainer}>
          {!isHide ? (
            <NavHeader withBackButton={true} />
          ) : (
            <NavHeader withBackButton={true} title={t("HelpAndSupport.LiveChatScreen.headerTitle")} />
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
  backgroundBottom: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  backgroundLeftBottom: {
    left: 0,
    position: "absolute",
    top: 82,
  },
  backgroundLeftTop: {
    left: 0,
    position: "absolute",
    top: 0,
  },
  backgroundRight: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  container: {
    flex: 1,
  },
});
