import React from "react";
import { View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import useThemeStyles from "@/theme/use-theme-styles";

export default function TransactionDetailsItem({ label, value }: { label: string; value: string }) {
  const transactionContentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  return (
    <View style={transactionContentStyle}>
      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
        {label}
      </Typography.Text>
      <Typography.Text size="footnote" weight="regular" color="neutralBase">
        {value}
      </Typography.Text>
    </View>
  );
}
