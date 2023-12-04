import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useExcludeFromSummary } from "../hooks/query-hooks";

interface ExcludeFromSummaryProps {
  transactionId: string;
  isHidden: string;
}

export default function ExcludeFromSummary({ transactionId, isHidden }: ExcludeFromSummaryProps) {
  const { t } = useTranslation();
  const excludeFromSummaryMutation = useExcludeFromSummary();

  const [isExcluded, setIsExcluded] = useState(isHidden === "Y");

  const handleSwitchChange = async (newValue: boolean) => {
    setIsExcluded(newValue);

    try {
      return await excludeFromSummaryMutation.mutateAsync({ transactionId, hiddenFlag: newValue });
    } catch (error) {
      setIsExcluded(!newValue);
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    alignItems: "center",
    gap: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        <Typography.Text color="neutralBase+30" size="callout">
          {t("ViewTransactions.SingleTransactionDetailedScreen.switchTitle")}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote">
          {t("ViewTransactions.SingleTransactionDetailedScreen.switchDescription")}
        </Typography.Text>
      </View>
      <Toggle onPress={() => handleSwitchChange(!isExcluded)} value={isExcluded} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
