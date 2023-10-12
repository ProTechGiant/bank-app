import { I18nManager, Image, StyleSheet, View } from "react-native";

import NeraPlus from "../images/neraPlusCard.png";
import Recommended from "./Recommended";

export default function NeraPlusCard() {
  return (
    <View style={styles.imageContainer}>
      <Image source={NeraPlus} style={styles.image} />
      <View style={styles.recommended}>
        <Recommended />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 115,
    width: 180,
  },
  imageContainer: {
    position: "relative",
  },
  recommended: {
    [I18nManager.isRTL ? "left" : "right"]: 10,
    position: "absolute",
  },
});
