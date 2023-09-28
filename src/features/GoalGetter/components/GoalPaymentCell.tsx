import { Pressable, StyleSheet, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CategoryCellProps {
  onPress?: () => void;
  title: string;
  subTitle?: string;
  valueOnRight: string;
  icon: React.ReactElement;
}

export default function GoalPaymentCell({ title, subTitle, onPress, icon, valueOnRight }: CategoryCellProps) {
  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        {icon}
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
        <Typography.Text size="callout" color="neutralBase+30">
          {valueOnRight}
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
