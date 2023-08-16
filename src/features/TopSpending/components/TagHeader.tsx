import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { formatCurrency } from "@/utils";

interface TagHeaderProp {
  TotalAmount: number;
}
export default function TagHeader({ TotalAmount }: TagHeaderProp) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
