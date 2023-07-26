import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { AccountIcon, HideIcon, ShowIcon } from "../assets";
import BrandDividerSvg from "../assets/brand-divider.svg";

interface CardProps {
  balance?: number;
  accountNumber?: string;
  currency?: string;
}
export default function BalanceCard({ balance, accountNumber, currency }: CardProps) {
  const { t } = useTranslation();
  const addToast = useToasts();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const handleOnAccountNumberPress = () => {
    if (undefined === accountNumber) return;
    Clipboard.setString(accountNumber);
    addToast({ variant: "confirm", message: t("Home.DashboardScreen.AccountNumberCopied"), position: "bottom" });
  };

  const accountNumberFormatter = (accountNumberValue: string) => {
    return accountNumberValue.replace(/.{1,3}/g, "$& ");
  };

  const balanceCardWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
  }));

  const balanceCardStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    overflow: "hidden",
    width: "100%",
    height: 162,
  }));

  const cardHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["8p"],
    borderTopLeftRadius: theme.radii.small,
    borderTopRightRadius: theme.radii.small,
    overflow: "hidden",
  }));

  const BrandDividerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 32,
    width: "100%",
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const balanceCardFooterStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-50"],
    flex: 1,
    paddingHorizontal: theme.spacing["16p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: theme.radii.small,
    borderBottomRightRadius: theme.radii.small,
  }));

  const balanceHiddenTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  return (
    <View style={balanceCardWrapperStyle}>
      <WithShadow backgroundColor="neutralBase-50" borderRadius="small">
        <View style={balanceCardStyle}>
          <View style={cardHeaderStyle}>
            <View>
              <Typography.Text color="neutralBase+10" size="caption2" weight="regular">
                {t("Home.DashboardScreen.totalbalance")}
              </Typography.Text>
              <View style={styles.headerBalanceStyle}>
                {isBalanceVisible ? (
                  <>
                    <Typography.Text color="primaryBase-20" size="title1" weight="medium">
                      {formatCurrency(balance ?? 0)}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                      {" " + currency ?? "SAR"}
                    </Typography.Text>
                  </>
                ) : (
                  <View style={balanceHiddenTextContainerStyle}>
                    <Typography.Text color="primaryBase-20" size="title3" weight="medium">
                      {t("Home.DashboardScreen.balanceHidden")}
                    </Typography.Text>
                  </View>
                )}
              </View>
            </View>
            <View>
              <Pressable onPress={() => setIsBalanceVisible(visible => !visible)}>
                {isBalanceVisible ? <HideIcon /> : <ShowIcon />}
              </Pressable>
            </View>
          </View>
          <View style={BrandDividerContainerStyle}>
            <BrandDividerSvg />
          </View>
          <View style={balanceCardFooterStyle}>
            <View>
              <Typography.Text color="neutralBase+10" size="caption2" weight="regular">
                {t("Home.DashboardScreen.mainCroatiaAccount")}
              </Typography.Text>
              <Pressable onPress={handleOnAccountNumberPress}>
                <Typography.Text color="primaryBase-20" size="caption2" weight="medium">
                  {accountNumber ? accountNumberFormatter(accountNumber) : null}
                </Typography.Text>
              </Pressable>
            </View>
            <View style={styles.accountCountainer}>
              <Typography.Text color="primaryBase-10" size="caption2" weight="medium">
                {t("Home.DashboardScreen.account")}
              </Typography.Text>
              <AccountIcon />
            </View>
          </View>
        </View>
      </WithShadow>
    </View>
  );
}

const styles = StyleSheet.create({
  accountCountainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerBalanceStyle: {
    alignItems: "baseline",
    flexDirection: "row",
  },
});
