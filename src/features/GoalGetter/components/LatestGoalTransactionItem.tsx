import { Pressable, StyleSheet, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import FormatTransactionAmount from "./FormatTransactionAmount";

interface LatestGoalTransactionProps {
  onPress?: () => void;
  title: string;
  subTitle: string;
  amount: number;
}

export default function LatestGoalTransactionItem({ title, subTitle, onPress, amount }: LatestGoalTransactionProps) {
  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" color="neutralBase+30">
            {title}
          </Typography.Text>
          {subTitle ? (
            <Typography.Text size="footnote" color="neutralBase">
              {subTitle}
            </Typography.Text>
          ) : null}
        </Stack>
        <Typography.Text color="neutralBase+10" size="callout" weight="medium">
          {FormatTransactionAmount(amount, true, "successBase", true)}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
});
