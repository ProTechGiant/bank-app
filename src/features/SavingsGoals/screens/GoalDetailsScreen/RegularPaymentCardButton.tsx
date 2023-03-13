import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

interface RegularPaymentCardButton {
  onPress: () => void;
  text: string;
  icon: React.ReactNode;
  subtext?: string;
}

export default function RegularPaymentCardButton({ onPress, text, icon, subtext }: RegularPaymentCardButton) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" justify="space-between" style={containerStyle} align="center">
        <Stack direction="horizontal" gap="16p" style={styles.cardStackStyle}>
          <View style={styles.iconStyle}>{icon}</View>
          <View>
            <Typography.Text size="callout">{text}</Typography.Text>
            {subtext && (
              <Typography.Text size="footnote" color="neutralBase" style={styles.subtitleStyle}>
                {subtext}
              </Typography.Text>
            )}
          </View>
        </Stack>

        <ChevronRightIcon color="#CCCCCC" />
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardStackStyle: {
    alignItems: "center",
    flex: 1,
  },

  iconStyle: {
    alignItems: "center",
    width: 22,
  },
  subtitleStyle: {
    marginTop: 4,
  },
});
