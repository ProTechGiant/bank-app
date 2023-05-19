import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

import Typography from "../Typography";

export interface TextEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
  text: string;
  hasBackground?: boolean;
}

export default function TextEndButton({ color = "primaryBase-10", onPress, text, hasBackground }: TextEndButtonProps) {
  const iconBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    opacity: 0.6,
    flex: 1,
  }));

  return (
    <Pressable onPress={onPress} style={[styles.container, hasBackground === true ? iconBackgroundStyle : undefined]}>
      <Typography.Text color={color}>{text}</Typography.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
