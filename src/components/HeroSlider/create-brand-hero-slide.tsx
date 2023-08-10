import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export default function createBrandHeroSlide(
  topElement: ReactNode,
  title: string,
  text: string,
  topExtraStyle: ViewStyle | undefined,
  bottomExtraStyle: ViewStyle | undefined
) {
  return {
    topElement: <View style={[styles.topElement, ...([topExtraStyle] ?? [])]}>{topElement}</View>,
    title: title,
    text: text,
    containerStyle: styles.containerStyle,
    bottomElementStyle: [styles.bottomElement, ...([bottomExtraStyle] ?? [])],
  };
}

const styles = StyleSheet.create({
  bottomElement: {
    position: "absolute",
    width: "100%",
  },
  containerStyle: {
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  topElement: {
    alignItems: "center",
    justifyContent: "center",
  },
});
