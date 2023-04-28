import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import BackgroundBottomSvg from "./assets/background-bottom.svg";
import BackgroundLeftBottomSvg from "./assets/background-left-bottom.svg";
import BackgroundRightSvg from "./assets/background-right.svg";
import BackgroundTopLeftSvg from "./assets/background-top-left.svg";

export default function LiveChatScreenHeader() {
  const { t } = useTranslation();

  const navHeaderContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent" />

      <View style={styles.backgroundImage}>
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
      </View>
      <View style={navHeaderContainer}>
        <NavHeader withBackButton={true} title={t("HelpAndSupport.LiveChatScreen.navHeaderTitle")} />
      </View>
    </View>
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
