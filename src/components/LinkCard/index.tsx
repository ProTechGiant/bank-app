import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Icons } from "@/assets/icons";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";

interface LinkCardProps {
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

const LinkCard = ({ onNavigate, children, style }: LinkCardProps) => {
  const ChevronRight = Icons["ChevronRight"];

  const handlePress = () => {
    onNavigate();
  };
  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
      <View style={styles.textContainer}>{children}</View>
      <View style={styles.arrowContainer}>
        <ChevronRight height={iconDimensions.link} width={iconDimensions.link} />
      </View>
    </Pressable>
  );
};

export default LinkCard;

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  container: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: spacing.large,
    shadowColor: palette.shadeBase,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.15,
  },
  textContainer: {
    marginEnd: 10,
  },
});
