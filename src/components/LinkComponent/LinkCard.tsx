import { I18nManager, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

interface LinkCardProps {
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export default function LinkCard({ onNavigate, children, style, testID }: LinkCardProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.spacing["16p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const handlePress = () => {
    onNavigate();
  };

  return (
    <Pressable style={[container, style]} onPress={handlePress} testID={testID}>
      <View style={styles.textContainer}>{children}</View>
      <View style={styles.arrowContainer}>
        <ChevronRightIcon color={chevronColor} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    width: 24,
  },
  textContainer: {
    marginEnd: 10,
  },
});
