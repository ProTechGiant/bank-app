import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

interface TagHeaderProp {
  TotalAmount: number;
}
export default function TagHeader({ TotalAmount }: TagHeaderProp) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-40"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }));
  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+30" size="title2" weight="medium">
        {t("TopSpending.SingleTagScreen.spendingSummary")}
      </Typography.Text>
      <Typography.Text color="neutralBase+30" size="title2" weight="semiBold">
        {formatCurrency(TotalAmount)}
        <Typography.Text color="primaryBase-40" size="body">
          {" "}
          {t("Currency.sar")}
        </Typography.Text>
      </Typography.Text>
    </View>
  );
}
