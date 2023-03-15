import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

interface LinkCardProps {
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

const LinkCard = ({ onNavigate, children, style }: LinkCardProps) => {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: theme.spacing["24p"],
      shadowColor: theme.palette["primaryBase-10"],
      shadowOffset: {
        width: 1,
        height: 3,
      },
      shadowOpacity: 0.15,
    }),
    []
  );

  const handlePress = () => {
    onNavigate();
  };
  return (
    <Pressable style={[container, style]} onPress={handlePress}>
      <View style={styles.textContainer}>{children}</View>
      <View style={styles.arrowContainer}>
        <ChevronRightIcon />
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
  textContainer: {
    marginEnd: 10,
  },
});
