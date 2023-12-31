import { Pressable } from "react-native";

import { Stack, Typography } from "@/components";
import useNavigation from "@/navigation/use-navigation";

import { ArrowNothEastIcon, ArrowSouthWestIcon } from "../assets/icons";

interface TransactionItemProps {
  name: string;
  code: string;
  investedValue: string;
  status: string;
  orderType: string;
  tradeTime?: string;
  orderCurrency: string;
}

export default function TransactionItem({
  name,
  code,
  investedValue,
  status,
  orderType,
  tradeTime,
  orderCurrency,
}: TransactionItemProps) {
  const navigation = useNavigation();

  const handleonPress = () => {
    navigation.navigate("MutualFund.MutualFundOrderSummaryScreen", {
      status,
      fundName: name,
      accountNumber: code,
      investedValue: investedValue,
    });
  };

  return (
    <Pressable onPress={handleonPress}>
      <Stack direction="horizontal" justify="space-between" style={{ width: "100%" }}>
        <Stack direction="horizontal" gap="16p">
          {orderType === "BUY" ? <ArrowSouthWestIcon /> : <ArrowNothEastIcon />}
          <Stack direction="vertical">
            <Typography.Text size="callout" weight="regular">
              {orderType}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {tradeTime}
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="horizontal">
          <Stack direction="vertical" align="flex-end">
            <Typography.Text
              size="callout"
              weight="medium"
              color={orderType === "BUY" ? "neutralBase+30" : "complimentBase"}>
              {orderType === "BUY" ? "+" : "-"}
              {investedValue} {orderCurrency}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {status}
            </Typography.Text>
          </Stack>
        </Stack>
      </Stack>
    </Pressable>
  );
}
