import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface FinancialInformationSectionProps {
  label: string;
  value?: string;
}

export default function FinancialInformationSection({ label, value }: FinancialInformationSectionProps) {
  const textStyle = useThemeStyles<TextStyle>(theme => ({
    paddingLeft: theme.spacing["12p"],
    paddingTop: theme.spacing["4p"],
  }));

  const inputStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <View style={inputStyle}>
      <View style={styles.cardItems}>
        <View>
          <Typography.Text color="neutralBase-10" weight="regular" size="footnote" style={textStyle}>
            {label}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={textStyle}>
            {value}
          </Typography.Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  cardItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
