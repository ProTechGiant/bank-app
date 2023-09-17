import { I18nManager, StyleSheet } from "react-native";

import AnimationView from "@/components/AnimationView";
import Stack from "@/components/Stack";

import tasksIconAnimation from "../assets/illustrations/tasks-icon-animation.json";

export default function BulletinBoardSectionIcon() {
  return (
    <Stack direction="vertical" align="center" justify="center" style={styles.iconContainer}>
      <AnimationView source={tasksIconAnimation} style={styles.animationViewContainer} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  animationViewContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    transform: [{ scale: I18nManager.isRTL ? -1.5 : 1.5 }],
    width: "100%",
  },
  iconContainer: {
    height: 37,
    width: 40,
  },
});
