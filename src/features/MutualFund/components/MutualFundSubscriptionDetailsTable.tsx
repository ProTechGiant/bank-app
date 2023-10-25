import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import { useThemeStyles } from "@/theme";

export default function MutualFundSubscriptionDetailsTable() {
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
  const mutualFundOrderDetailsTableContent = [
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.subscriptionFee"),
      value: "2.00%",
    },
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.minimumsubscription"),
      value: "5,000 SAR",
    },
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.minimumAdditionalSubscription"),
      value: "2,000 SAR",
    },
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.category"),
      value: "Mid-Cap Funds ",
    },
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.dividend"),
      value: "SA",
    },
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.frequency"),
      value: "Bi-weekly",
    },
    {
      title: t("MutualFund.MutualFundDetailsScreen.subscriptionDetails.strategy"),
      value: "Income",
    },
  ];

  return (
    <Stack direction="vertical" style={tableStackStyle} align="stretch">
      {mutualFundOrderDetailsTableContent.map((item, index) => {
        return (
          <Stack direction="vertical" align="stretch" key={index}>
            <Divider color="neutralBase-30" />
            <Stack direction="horizontal" justify="space-between" style={orderDetailsTableContentStyle}>
              <Stack direction="vertical" flex={1}>
                <Typography.Text weight="regular" size="footnote" color="neutralBase">
                  {item.title}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" flex={1} align="flex-end">
                <Typography.Text weight="regular" size="callout">
                  {item.value}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
