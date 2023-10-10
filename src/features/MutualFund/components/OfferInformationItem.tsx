import { StyleSheet, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Divider from "@/components/Divider";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface OfferInformationItemProps {
  label: string;
  value: any;
  hasDivider?: boolean;
}

export default function OfferInformationItem({ label, value, hasDivider = true }: OfferInformationItemProps) {
  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <>
      <Stack direction="horizontal" justify="space-between" gap="16p" style={stackStyle}>
        <Typography.Text color="neutralBase+30" size="callout" weight="regular" style={styles.labelStyle}>
          {label}
        </Typography.Text>
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {value}
        </Typography.Text>
      </Stack>
      {hasDivider ? <Divider color="neutralBase-30" /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    flexBasis: "50%",
  },
});
