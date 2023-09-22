import LottieView, { AnimationObject } from "lottie-react-native";
import { useEffect, useRef } from "react";
import { AppState, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface AnimationViewProps {
  autoplay?: boolean;
  speed?: number;
  source: string | AnimationObject | { uri: string };
  style?: StyleProp<ViewStyle>;
}

export default function AnimationView({ source, speed = 1, autoplay = true, style }: AnimationViewProps) {
  const animationRef = useRef<LottieView>(null);
  const appState = useRef(AppState.currentState);

  const resumeAnimation = () => {
    animationRef.current?.resume();
  };

  // if user leaves app, the animation will resume playing when they return instead of ending the animation.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        resumeAnimation();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <LottieView ref={animationRef} source={source} autoPlay={autoplay} speed={speed} style={[styles.lottie, style]} />
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
