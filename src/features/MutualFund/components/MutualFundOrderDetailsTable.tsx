import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import { useThemeStyles } from "@/theme";

import { CheckProductRiskResponse, PaymentEnum } from "../types";

interface MutualFundOrderDetailsTableProps {
  hasHeader?: boolean;
  checkProductRiskData?: CheckProductRiskResponse;
  startingAmount?: string;
  monthlyAmount?: string;
  selectedPayment?: string;
}

export default function MutualFundOrderDetailsTable({
  hasHeader,
  checkProductRiskData,
  startingAmount,
  monthlyAmount,
  selectedPayment,
}: MutualFundOrderDetailsTableProps) {
  const { t } = useTranslation();

  const translatePayment = () => {
    switch (selectedPayment) {
      case PaymentEnum.Monthly:
        return t("MutualFund.SubscriptionSummaryScreen.paymentMonthly");
      case PaymentEnum.OneTime:
        return t("MutualFund.SubscriptionSummaryScreen.paymentOneTime");
      default:
        return selectedPayment;
    }
  };

  const tableStackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
  }));

  const orderDetailsTableContentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  const orderAccountContentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette.neutralBase,
    borderRadius: theme.radii.small,
  }));

  const mutualFundOrderDetailsTableContent = {
    OrderList: [
      {
        title: t("MutualFund.SubscriptionSummaryScreen.startingAmount"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: startingAmount }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.monthlyAmount"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: monthlyAmount }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.payment"),
        value: translatePayment(),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.deductionDay"),
        value: 28, // TODO: add value in next BC , this is the default value
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.minimumSubscribe"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: checkProductRiskData?.MinimumSubscription }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.subscribeFees"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: checkProductRiskData?.SubscriptionFees }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.totalAmount"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: startingAmount }),
        boldText: true,
      },
    ],
  };

  const mutualFundOrderDetailsOneTimeTableContent = {
    OrderList: [
      {
        title: t("MutualFund.SubscriptionSummaryScreen.startingAmount"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: startingAmount }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.payment"),
        value: translatePayment(),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.minimumSubscribe"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: checkProductRiskData?.MinimumSubscription }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.subscribeFees"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: checkProductRiskData?.SubscriptionFees }),
      },
      {
        title: t("MutualFund.SubscriptionSummaryScreen.totalAmount"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: startingAmount }),
        boldText: true,
      },
    ],
  };

  const tableContent =
    selectedPayment === PaymentEnum.Monthly
      ? mutualFundOrderDetailsTableContent
      : mutualFundOrderDetailsOneTimeTableContent;

  return (
    <Stack direction="vertical" style={tableStackStyle} align="stretch">
      {hasHeader ? (
        <Stack direction="vertical" align="stretch" gap="8p" style={orderDetailsTableContentStyle}>
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {t("MutualFund.SubscriptionSummaryScreen.from")}
          </Typography.Text>
          <Stack direction="horizontal" gap="24p">
            <Stack direction="vertical" gap="4p" style={orderAccountContentStyle}>
              <Typography.Text size="caption1" weight="regular" color="neutralBase-60">
                {t("MutualFund.SubscriptionSummaryScreen.currentAcc")}
              </Typography.Text>
              <Typography.Text size="caption1" weight="regular" color="neutralBase-60">
                {"••••" + checkProductRiskData?.AccountNumber.slice(-4)}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" gap="4p">
              <Typography.Text size="callout" weight="regular">
                {t("MutualFund.SubscriptionSummaryScreen.availableBalance")}
              </Typography.Text>
              <Typography.Text size="callout" weight="bold">
                {t("MutualFund.MutualFundDetailsScreen.sar", { value: checkProductRiskData?.AccountBalance })}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>
      ) : null}
      {tableContent.OrderList.map(orderDetail => {
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
                <Typography.Text weight={orderDetail.boldText ? "bold" : "regular"} size="callout">
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
