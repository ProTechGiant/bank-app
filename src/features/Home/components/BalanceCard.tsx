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
import { formatCurrency } from "@/utils";

import { CopyAccountIcon, EyeHideIcon, EyeShowIcon, NavigateToAccountIcon, RefreshBalanceIcon } from "../assets/icons";
import { formatAccountNumber } from "../utils";

interface BalanceCardProps {
  balance?: number;
  accountNumber?: string;
  onBalanceRefresh: () => void;
  testID?: string;
}

export default function BalanceCard({ balance, accountNumber, onBalanceRefresh, testID }: BalanceCardProps) {
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
    backgroundColor: theme.palette.transparent,
    margin: theme.spacing["20p"],
    marginTop: 0,
    marginBottom: theme.spacing["24p"],
    borderRadius: theme.radii.medium,
  }));

  const balanceCardInnerContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30-60%"],
    borderRadius: theme.radii.small,
    overflow: "hidden",
  }));

  const cardHeaderSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30-60%"],
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["12p"],
  }));

  const showBalanceIconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  const balanceCardFooterStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30-60%"],
    paddingHorizontal: theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Stack testID={testID} direction="vertical" align="stretch" style={balanceCardContainer}>
      <WithShadow backgroundColor="neutralBase+30-60%" borderRadius="medium">
        <Stack direction="vertical" align="stretch" style={balanceCardInnerContainer}>
          <Stack direction="vertical" align="stretch" style={cardHeaderSectionStyle}>
            <Typography.Text color="neutralBase-20" size="footnote">
              {t("Home.DashboardScreen.totalSarBalance")}
            </Typography.Text>
            <Stack direction="horizontal" align="center" justify="space-between">
              {balance !== undefined ? (
                <>
                  <Typography.Text
                    color="neutralBase-60"
                    size="large"
                    weight="bold"
                    testID={testID !== undefined ? `${testID}-AccountBalance` : undefined}>
                    {isBalanceVisible ? formatCurrency(balance, "SAR") : "********"}
                  </Typography.Text>
                  <Pressable
                    style={showBalanceIconStyle}
                    onPress={handleOnShowBalancePress}
                    testID={testID !== undefined ? `${testID}-ToggleAccountBalanceButton` : undefined}>
                    {isBalanceVisible ? <EyeShowIcon /> : <EyeHideIcon />}
                  </Pressable>
                </>
              ) : (
                <>
                  <Typography.Text color="neutralBase-60" size="title1" weight="regular">
                    {t("Home.DashboardScreen.updating")}
                  </Typography.Text>
                  <Pressable
                    style={showBalanceIconStyle}
                    onPress={handleOnRefreshBalancePress}
                    testID={testID !== undefined ? `${testID}-RefreshBalancePress` : undefined}>
                    <RefreshBalanceIcon />
                  </Pressable>
                </>
              )}
            </Stack>
          </Stack>
          <Stack direction="horizontal" align="center" justify="center" gap="16p" style={balanceCardFooterStyle}>
            <Stack direction="horizontal" gap="4p" style={styles.accountTextContainer} align="center">
              <Typography.Text
                color="neutralBase-30"
                size="footnote"
                weight="medium"
                testID="Home.DashboardScreen:AccountNumber">
                {accountNumber ? formatAccountNumber(accountNumber) : null}
              </Typography.Text>
              <Pressable
                style={styles.iconContainer}
                onPress={handleOnAccountDetailsPress}
                testID={testID !== undefined ? `${testID}-NavigateToAccountButton` : undefined}>
                <NavigateToAccountIcon />
              </Pressable>
            </Stack>
            <Pressable
              style={styles.iconContainer}
              onPress={handleOnCopyNumberPress}
              testID={testID !== undefined ? `${testID}-CopyNumberButton` : undefined}>
              <CopyAccountIcon />
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
  iconContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
