import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { generateShadow, useThemeStyles } from "@/theme";

interface LinkCardProps {
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

export default function LinkCard({ onNavigate, children, style }: LinkCardProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: theme.spacing["24p"],
  }));

  const handlePress = () => {
    onNavigate();
  };

  return (
    <Pressable style={[container, styles.shadow, style]} onPress={handlePress}>
      <View style={styles.textContainer}>{children}</View>
      <View style={styles.arrowContainer}>
        <ChevronRightIcon />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  shadow: generateShadow(3),
  textContainer: {
    marginEnd: 10,
  },
});
