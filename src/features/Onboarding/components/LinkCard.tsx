import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import { useThemeStyles } from "@/theme";

interface LinkCardProps {
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

export default function LinkCard({ onNavigate, children, style }: LinkCardProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: theme.spacing["24p"],
  }));

  const handlePress = () => {
    onNavigate();
  };

  return (
    <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall" elevation={3}>
      <Pressable style={[container, style]} onPress={handlePress}>
        <View style={styles.textContainer}>{children}</View>
        <View style={styles.arrowContainer}>
          <ChevronRightIcon />
        </View>
      </Pressable>
    </WithShadow>
  );
}

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
