import { StyleSheet, View } from "react-native";

import loaderAnimation from "@/assets/illustrations/loader.json";
import AnimationView from "@/components/AnimationView";

export default function FullScreenLoader() {
  return (
    <View style={styles.container}>
      <AnimationView source={loaderAnimation} style={styles.animation} />
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    height: 80,
    width: 80,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
