import LottieView, { AnimationObject } from "lottie-react-native";
import { useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface AnimationViewProps {
  autoplay?: boolean;
  speed?: number;
  source: string | AnimationObject | { uri: string };
  style?: StyleProp<ViewStyle>;
}

export default function AnimationView({ source, speed = 1, autoplay = true, style }: AnimationViewProps) {
  const animationRef = useRef<LottieView>(null);

  const playAnimation = () => {
    animationRef.current?.play();
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={source}
        autoPlay={autoplay}
        speed={speed}
        onAnimationFinish={() => {
          // if user leaves app, the animation will resume playing when they return instead of ending the animation.
          playAnimation();
        }}
        style={[styles.lottie, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    height: "100%",
  },
});
