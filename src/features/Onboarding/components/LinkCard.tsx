import { I18nManager, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
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
    padding: theme.spacing["24p"],
  }));

  const handlePress = () => {
    onNavigate();
  };

  return (
    <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall" elevation={3}>
      <Pressable style={[container, style]} onPress={handlePress} testID={testID}>
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
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    width: 24,
  },
  textContainer: {
    marginEnd: 10,
  },
});
