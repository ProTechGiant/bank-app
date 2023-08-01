import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CustomerBalanceProps {
  total: number;
  month: string;
  isCurrentMonth: boolean;
}
export default function CustomerBalance({ total, month, isCurrentMonth }: CustomerBalanceProps) {
  const { t } = useTranslation();

  const formattedValue = total.toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const wrapper = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <View style={wrapper}>
      <Typography.Text color="neutralBase+30" size="caption1">
        {`${
          isCurrentMonth
            ? t("TopSpending.TopSpendingScreen.currentSpendingIn")
            : t("TopSpending.TopSpendingScreen.totalSpending")
        } ${month}`}
      </Typography.Text>
      <Typography.Text color="neutralBase+30" size="title3" weight="bold">
        {formattedValue} {t("Currency.sar")}
      </Typography.Text>
    </View>
  );
}
