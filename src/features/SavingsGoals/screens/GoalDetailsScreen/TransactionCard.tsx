import { format } from "date-fns";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TransactionCardProps {
  title: string;
  amount?: number;
  date: string;
  onPress?: () => void;
  icon: React.ReactNode;
  separator?: boolean;
}

export default function TransactionCard({ title, amount, date, icon, separator, onPress }: TransactionCardProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" justify="space-between" style={containerStyle}>
        <Stack direction="horizontal" gap="16p" style={styles.cardStackStyle}>
          <View style={styles.iconContainerStyle}>{icon}</View>
          <View>
            <Typography.Text size="callout" weight="medium">
              {title}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase" style={styles.subtitleStyle}>
              {format(new Date(date), "dd MMM yyyy")}
            </Typography.Text>
          </View>
        </Stack>
        <Typography.Text size="callout" weight="regular" color="complimentBase">
          {amount} SAR
        </Typography.Text>
      </Stack>
      {separator && <Divider color="neutralBase-30" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardStackStyle: {
    alignItems: "center",
    flex: 1,
  },
  iconContainerStyle: {
    alignItems: "center",
    width: 22,
  },
  subtitleStyle: {
    marginTop: 4,
  },
});
