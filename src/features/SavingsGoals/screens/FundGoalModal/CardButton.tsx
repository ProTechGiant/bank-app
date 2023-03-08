import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

interface CardButtonProps {
  onPress: () => void;
  text: string;
  icon: React.ReactNode;
}

export default function CardButton({ onPress, text, icon }: CardButtonProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" justify="space-between" align="center" style={containerStyle}>
        <Stack direction="horizontal" gap="12p">
          <View style={styles.iconContainer}>{icon}</View>
          <Typography.Text>{text}</Typography.Text>
        </Stack>
        <ChevronRightIcon color="#CCCCCC" />
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    width: 22,
  },
});
