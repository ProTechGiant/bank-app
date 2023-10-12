import { StyleSheet, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InformationItemProps {
  label: string;
  value: string | number;
}

export default function InformationItem({ label, value }: InformationItemProps) {
  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Stack direction="horizontal" justify="space-between" gap="16p" style={stackStyle}>
      <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={styles.labelStyle}>
        {label}
      </Typography.Text>
      <Typography.Text color="neutralBase" size="callout" weight="medium">
        {value}
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    flexBasis: "50%",
  },
});
