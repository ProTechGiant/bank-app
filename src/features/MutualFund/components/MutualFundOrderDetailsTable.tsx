import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import { useThemeStyles } from "@/theme";

interface MutualFundOrderDetailsTableProps {
  hasHeader?: boolean;
}

export default function MutualFundOrderDetailsTable({ hasHeader }: MutualFundOrderDetailsTableProps) {
  const { t } = useTranslation();

  const tableStackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
  }));
  const orderDetailsTableContentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  //TODO: this table content will be replaced when it's API ready
  const mutualFundOrderDetailsTableContent = {
    ChargedFrom: {
      title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.chargedFrom"),
      value: "1122-001-0011223344555",
    },
    OrderList: [
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.fundName"),
        value: "Al Rajhi Saudi Equity",
      },
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.portfolio"),
        value: "Portfolio 02",
      },
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.transaction"),
        value: "Subscribe",
      },
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.currentUnitPrice"),
        value: "14.60 SAR",
      },
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.subscriptionAmount"),
        value: "29,738.00 SAR",
      },
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.minimumSubscription"),
        value: "29,738.00 SAR",
      },
      {
        title: t(
          "MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.minimumAdditionalSubscription"
        ),
        value: "2,000 SAR",
      },
      {
        title: t("MutualFund.MutualFundOrderSummaryScreen.mutualFundOrderDetailsTableContent.transactionFee"),
        value: "2.00%",
      },
    ],
  };

  return (
    <Stack direction="vertical" style={tableStackStyle} align="stretch">
      {hasHeader ? (
        <Stack direction="vertical" style={orderDetailsTableContentStyle}>
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {mutualFundOrderDetailsTableContent.ChargedFrom.title}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {mutualFundOrderDetailsTableContent.ChargedFrom.value}
          </Typography.Text>
        </Stack>
      ) : null}
      {mutualFundOrderDetailsTableContent.OrderList.map(orderDetail => {
        return (
          <Stack direction="vertical" align="stretch" key={orderDetail.title}>
            <Divider color="neutralBase-30" />
            <Stack direction="horizontal" justify="space-between" style={orderDetailsTableContentStyle}>
              <Stack direction="vertical" flex={1}>
                <Typography.Text weight="regular" size="footnote" color="neutralBase">
                  {orderDetail.title}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" flex={1} align="flex-end">
                <Typography.Text weight="regular" size="callout">
                  {orderDetail.value}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
