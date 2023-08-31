import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface GoalHeaderProps {
  transactionName: string;
  goalName?: string;
  amount: string;
  testID?: string;
}

export default function GoalHeader({ transactionName, goalName, amount, testID }: GoalHeaderProps) {
  const headerContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["20p"],
    justifyContent: "space-between",
    backgroundColor: theme.palette.primaryBase,
  }));

  return (
    <View style={headerContainer} testID={testID}>
      <View>
        <Typography.Text color="neutralBase-50" size="title3" weight="bold">
          {transactionName}
        </Typography.Text>
        <Typography.Text color="primaryBase-40" weight="regular" size="caption2">
          {goalName}
        </Typography.Text>
      </View>

      <View style={styles.sarStyle}>
        <FormatTransactionAmount
          amount={parseFloat(amount)}
          isPlusSignIncluded={false}
          integerSize="title2"
          decimalSize="body"
          color="neutralBase-50"
          isCurrencyIncluded={true}
          currencyColor="primaryBase-40"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sarStyle: {
    alignItems: "baseline",
    flexDirection: "row",
  },
});
