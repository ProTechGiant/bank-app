import LottieView, { AnimationObject } from "lottie-react-native";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface AnimationViewProps {
  autoplay?: boolean;
  speed?: number;
  source: string | AnimationObject | { uri: string };
  style?: StyleProp<ViewStyle>;
}

export default function AnimationView({ source, speed = 1, autoplay = true, style }: AnimationViewProps) {
  return (
    <View style={styles.container}>
      <LottieView source={source} autoPlay={autoplay} speed={speed} style={[styles.lottie, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  lottie: {
    height: "100%",
  },
});
