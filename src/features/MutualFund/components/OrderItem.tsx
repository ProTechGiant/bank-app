import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { FailedIcon, PendingwithLinesIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface OrderItemProps {
  name: string;
  status: string;
  units: string;
  investedValue: string;
  risk: string;
  expectedReturn?: string;
  code: string;
}
export default function OrderItem({ name, status, units, investedValue, risk, expectedReturn, code }: OrderItemProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const variant =
    risk === "High Risk" ? "pink" : risk === "Mid Risk" ? "yellow" : risk === "Low Risk" ? "blue" : "default";

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    borderWidth: 1,
    borderRadius: theme.spacing["8p"],
    width: "100%",
    borderColor: theme.palette["neutralBase-30"],
  }));

  const stackBorderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRightWidth: 1,
    borderRightColor: theme.palette["neutralBase-30"],
    paddingVertical: theme.spacing["4p"],
    paddingRight: theme.spacing["16p"],
  }));

  const riskStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["8p"],
      paddingVertical: theme.spacing["4p"],
      borderRadius: theme.radii.extraSmall,
      backgroundColor:
        variant === "blue"
          ? theme.palette["secondary_blueBase-20"]
          : variant === "yellow"
          ? theme.palette["secondary_yellowBase-30"]
          : variant === "pink"
          ? theme.palette["secondary_pinkBase-30"]
          : undefined,
    }),
    [variant]
  );

  const handleonPress = () => {
    navigation.navigate("MutualFund.MutualFundOrderSummaryScreen", {
      status,
      fundName: name,
      accountNumber: code,
      investedValue: investedValue,
    });
  };

  return (
    <Pressable onPress={handleonPress} style={containerStyle}>
      <View>
        <Stack direction="vertical" gap="8p">
          <Stack direction="horizontal" justify="space-between" style={styles.container}>
            <View style={riskStyle}>
              <Typography.Text weight="bold" size="caption2" color="neutralBase+30">
                {risk}
              </Typography.Text>
            </View>
            {status === "Pending" ? (
              <Stack direction="horizontal" gap="4p">
                <PendingwithLinesIcon />
                <Typography.Text weight="medium" size="caption1">
                  {status}
                </Typography.Text>
              </Stack>
            ) : status === "Failed" ? (
              <Stack direction="horizontal" gap="4p">
                <FailedIcon />
                <Typography.Text color="complimentBase" weight="medium" size="caption1">
                  {status}
                </Typography.Text>
              </Stack>
            ) : null}
          </Stack>
          <Typography.Text size="callout" weight="medium">
            {name}
          </Typography.Text>
          <Stack direction="horizontal" gap="16p">
            <Stack direction="vertical" gap="4p" style={[styles.stackStyle, stackBorderStyle]}>
              <Typography.Text color="neutralBase-10" size="caption1" weight="regular">
                {t("MutualFund.ViewOrdersScreen.investedValue")}
              </Typography.Text>
              <Typography.Text size="footnote" weight="medium">
                {investedValue}
              </Typography.Text>
            </Stack>
            {expectedReturn ? (
              <Stack direction="vertical" gap="4p" style={[styles.stackStyle, stackBorderStyle, { flex: 1.2 }]}>
                <Typography.Text color="neutralBase-10" size="caption1" weight="regular">
                  {t("MutualFund.ViewOrdersScreen.expectedReturns")}
                </Typography.Text>
                <Typography.Text color="complimentBase" size="footnote" weight="medium">
                  {expectedReturn}
                </Typography.Text>
              </Stack>
            ) : null}
            <Stack direction="vertical" gap="4p" style={styles.stackStyle}>
              <Typography.Text color="neutralBase-10" size="caption1" weight="regular">
                {t("MutualFund.ViewOrdersScreen.units")}
              </Typography.Text>
              <Typography.Text size="footnote" weight="medium">
                {units}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  stackStyle: { flex: 1 },
});
