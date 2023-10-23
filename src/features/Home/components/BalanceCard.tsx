import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";

import { WithShadow } from "@/components";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import {
  CardBrandDivider,
  CopyAccountIcon,
  EyeHideIcon,
  EyeShowIcon,
  NavigateToAccountIcon,
  RefreshBalanceIcon,
} from "../assets/icons";
import { formatAccountNumber } from "../utils";

interface BalanceCardProps {
  balance?: number;
  accountNumber?: string;
  onBalanceRefresh: () => void;
}

export default function BalanceCard({ balance, accountNumber, onBalanceRefresh }: BalanceCardProps) {
  const { t } = useTranslation();
  const addToast = useToasts();
  const navigation = useNavigation();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const handleOnAccountDetailsPress = () => {
    navigation.navigate("Home.AccountDetailsScreen");
  };

  const handleOnCopyNumberPress = () => {
    if (accountNumber) {
      Clipboard.setString(accountNumber);
      addToast({ variant: "confirm", message: t("Home.DashboardScreen.AccountNumberCopied"), position: "bottom" });
    }
  };

  const handleOnShowBalancePress = () => setIsBalanceVisible(visible => !visible);

  const handleOnRefreshBalancePress = () => {
    onBalanceRefresh();
  };

  const balanceCardContainer = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
  }));

  const balanceCardInnerContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
    overflow: "hidden",
  }));

  const cardHeaderSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["12p"],
  }));

  const showBalanceIconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  const balanceCardFooterStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
      <WithShadow backgroundColor="neutralBase-50" borderRadius="small">
        <Stack direction="vertical" align="stretch" style={balanceCardInnerContainer}>
          <Stack direction="vertical" align="stretch" style={cardHeaderSectionStyle}>
            <Typography.Text color="neutralBase+10" size="footnote">
              {t("Home.DashboardScreen.totalSarBalance")}
            </Typography.Text>
            <Stack direction="horizontal" align="center" justify="space-between">
              {balance ? (
                <>
                  <Typography.Text
                    color="neutralBase+30"
                    size="large"
                    weight="bold"
                    testID="Home.DashboardScreen:AccountBalance">
                    {isBalanceVisible ? balance.toLocaleString("en-US") : "********"}
                  </Typography.Text>
                  <Pressable
                    style={showBalanceIconStyle}
                    onPress={handleOnShowBalancePress}
                    testID="Home.DashboardScreen:ToggleAccountBalanceButton">
                    {isBalanceVisible ? <EyeShowIcon /> : <EyeHideIcon />}
                  </Pressable>
                </>
              ) : (
                <>
                  <Typography.Text color="neutralBase+30" size="title1" weight="regular">
                    {t("Home.DashboardScreen.updating")}
                  </Typography.Text>
                  <Pressable style={showBalanceIconStyle} onPress={handleOnRefreshBalancePress}>
                    <RefreshBalanceIcon />
                  </Pressable>
                </>
              )}
            </Stack>
          </Stack>
          <Stack direction="vertical" style={styles.cardBrandDividerContainer}>
            <CardBrandDivider width="100%" height="100%" />
          </Stack>
          <Stack direction="horizontal" align="center" gap="16p" style={balanceCardFooterStyle}>
            <Stack direction="vertical" gap="4p" style={styles.accountTextContainer}>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {t("Home.DashboardScreen.mainCroatiaAccount")}
              </Typography.Text>
              <Typography.Text
                color="neutralBase+20"
                size="footnote"
                weight="medium"
                testID="Home.DashboardScreen:AccountNumber">
                {accountNumber ? formatAccountNumber(accountNumber) : null}
              </Typography.Text>
            </Stack>
            <Pressable
              style={styles.iconContainer}
              onPress={handleOnCopyNumberPress}
              testID="Home.DashboardScreen:CopyAccountNumberButton">
              <CopyAccountIcon />
            </Pressable>
            <Pressable
              style={styles.iconContainer}
              onPress={handleOnAccountDetailsPress}
              testID="Home.DashboardScreen:NavigateToAccountButton">
              <NavigateToAccountIcon />
            </Pressable>
          </Stack>
        </Stack>
      </WithShadow>
    </Stack>
  );
}

const styles = StyleSheet.create({
  accountTextContainer: {
    flexGrow: 1,
  },
  cardBrandDividerContainer: {
    aspectRatio: 14,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  iconContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
