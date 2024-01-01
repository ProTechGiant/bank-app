import { ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import Stack from "../Stack";
import Typography from "../Typography";

interface AccountBalanceCardProps {
  title: string;
  balance: number;
  accountType: string;
  accountLastFourDigits: string;
  currency: string;
  isError?: boolean;
}

export default function AccountBalanceCard({
  title,
  balance,
  accountType,
  accountLastFourDigits,
  currency,
  isError,
}: Readonly<AccountBalanceCardProps>) {
  const formattedBalance = formatCurrency(balance, undefined, 2);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.medium,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));
  const smallCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-10"],
    borderRadius: theme.radii.small,
    padding: theme.spacing["8p"],
    flex: 1,
    minHeight: theme.spacing["48p"],
  }));
  const availableBalanceStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 3.5,
    paddingHorizontal: theme.spacing["4p"],
    justifyContent: "center",
    padding: theme.spacing["4p"],
  }));

  return (
    <Stack direction="horizontal" style={containerStyle} gap="12p">
      <Stack direction="vertical" style={smallCardStyle}>
        <Typography.Text size="caption2" color="neutralBase-60">
          {accountType}
        </Typography.Text>
        <Typography.Text size="caption2" color="neutralBase-60">
          ...{accountLastFourDigits}
        </Typography.Text>
      </Stack>
      <Stack direction="vertical" style={availableBalanceStyle}>
        <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="footnote">
          {title}
        </Typography.Text>
        <Typography.Text color={isError ? "errorBase" : "neutralBase+30"} size="title2" weight="bold">
          {formattedBalance.split(".")[0]}
          <Typography.Text color={isError ? "errorBase" : "neutralBase+30"} size="title2">{`.${
            formattedBalance.split(".")[1]
          }${currency}`}</Typography.Text>
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
