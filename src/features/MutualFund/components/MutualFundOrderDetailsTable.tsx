import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import { useThemeStyles } from "@/theme";

import { mutualFundOrderDetailsTableContent } from "../mocks/mutualFundOrderDetailsTableContent";

export default function MutualFundOrderDetailsTable() {
  const tableStackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
  }));
  const orderDetailsTableContentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" style={tableStackStyle} align="stretch">
      <Stack direction="vertical" style={orderDetailsTableContentStyle}>
        <Typography.Text size="footnote" weight="regular" color="neutralBase">
          {mutualFundOrderDetailsTableContent.ChargedFrom.title}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular">
          {mutualFundOrderDetailsTableContent.ChargedFrom.value}
        </Typography.Text>
      </Stack>
      {mutualFundOrderDetailsTableContent.OrderList.map(orderDetail => {
        return (
          <Stack direction="vertical" align="stretch">
            <Divider color="neutralBase-30" />
            <Stack direction="horizontal" justify="space-between" style={orderDetailsTableContentStyle}>
              <Typography.Text weight="regular" size="footnote" color="neutralBase">
                {orderDetail.title}
              </Typography.Text>
              <Typography.Text weight="regular" size="callout">
                {orderDetail.value}
              </Typography.Text>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
