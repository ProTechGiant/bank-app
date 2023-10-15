import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TransactionItem } from "../types";
import TransactionSectionItem from "./TransactionSectionItem";

interface LatestTransactionSectionProps {
  onPressSeeMore: () => void;
  transactions: TransactionItem[];
}

export default function TransactionSection({ onPressSeeMore, transactions }: LatestTransactionSectionProps) {
  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["16p"],
    flex: 1,
    alignItems: "stretch",
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const itemsStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" style={contentStyles}>
      <Stack direction="horizontal" justify="space-between" align="center">
        <Typography.Text size="title2" weight="medium">
          {t("AllInOneCard.Dashboard.transaction")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="medium" style={textStyle} onPress={onPressSeeMore} color="successBase">
          {t("AllInOneCard.Dashboard.viewAll")}
        </Typography.Text>
      </Stack>
      <View style={itemsStyle}>
        {transactions.map((item, index) => {
          return (
            <TransactionSectionItem
              key={`${item.Title}-${index}`}
              title={item.Title}
              amount={item.Amount}
              subTitle={item.Date}
              status={item.Status}
              paymentType={item.PaymentType}
            />
          );
        })}
      </View>
    </Stack>
  );
}
