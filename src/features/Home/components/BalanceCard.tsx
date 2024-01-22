import Clipboard from "@react-native-clipboard/clipboard";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Platform, Pressable, StyleSheet, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import { CopyAccountIcon, EyeHideIcon, EyeShowIcon, NavigateToAccountIcon, RefreshBalanceIcon } from "../assets/icons";
import { formatAccountNumber } from "../utils";

interface BalanceCardProps {
  balance?: number;
  accountNumber?: string;
  onBalanceRefresh: () => void;
  testID?: string;
  balanceVisibility: boolean;
  toggleBalanceVisibility: (visible: boolean) => void;
}

export default function BalanceCard({
  balance,
  accountNumber,
  onBalanceRefresh,
  testID,
  balanceVisibility,
  toggleBalanceVisibility,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const addToast = useToasts();
  const navigation = useNavigation();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });
  const checkBalance = balance ?? 0;
  const formattedBalance = formatter.format(checkBalance);
  const [dollars, cents] = formattedBalance.split(".");

  const handleOnAccountDetailsPress = () => {
    navigation.navigate("Home.AccountDetailsScreen");
  };

  const handleOnCopyNumberPress = () => {
    if (accountNumber) {
      Clipboard.setString(accountNumber);
      addToast({ variant: "confirm", message: t("Home.DashboardScreen.AccountNumberCopied"), position: "bottom" });
    }
  };

 
  const handleOnRefreshBalancePress = () => {
    onBalanceRefresh();
  };

  const balanceCardContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.transparent,
    margin: theme.spacing["20p"],
    marginTop: theme.spacing["12p"],
    marginBottom: theme.spacing["24p"],
  }));

  const balanceCardInnerContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: Platform.OS === "android" ? theme.palette["neutralBase+30-60%"] : "",
    borderRadius: theme.radii.small,
    overflow: "hidden",
  }));

  const cardHeaderSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["20p"],
  }));

  const showBalanceIconStyle = useThemeStyles<ViewStyle>(theme => ({
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    borderRadius: theme.radii.xxlarge,
    backgroundColor: theme.palette["neutralBase+30"],
    padding: 6,
    marginBottom: theme.spacing["12p"],
  }));

  const balanceCardFooterStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
  }));

  const borderContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette.neutralBaseHover,
    overflow: "hidden",
    borderRadius: theme.radii.medium,
  }));
  const balanceCentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  return (
    <Stack testID={testID} direction="vertical" align="stretch" style={balanceCardContainer}>
      <BlurView
        overlayColor="transparent"
        blurRadius={9}
        blurAmount={12}
        blurType="dark"
        style={borderContainerStyle}
        reducedTransparencyFallbackColor="white">
        <Stack
          direction="vertical"
          align="stretch"
          style={[balanceCardInnerContainer, Platform.OS === "android" ? borderContainerStyle : null]}>
          <Stack direction="vertical" align="stretch" style={cardHeaderSectionStyle} gap="4p">
            <Pressable
              onPress={handleOnAccountDetailsPress}
              testID={testID !== undefined ? `${testID}-NavigateToAccountButton` : undefined}>
              <Typography.Text color="neutralBase-20" size="footnote">
                {t("Home.DashboardScreen.totalSarBalance")}
              </Typography.Text>
            </Pressable>
            <Stack direction="horizontal" align="center" justify="space-between">
              {balance !== undefined ? (
                <>
                  <Pressable
                    onPress={handleOnAccountDetailsPress}
                    style={styles.accountTextContainer}
                    testID={testID !== undefined ? `${testID}-NavigateToAccountButton` : undefined}>
                    <Stack direction="horizontal">
                      <Typography.Text
                        color="neutralBase-60"
                        size="large"
                        weight="bold"
                        testID={testID !== undefined ? `${testID}-AccountBalance` : undefined}>
                        {balanceVisibility ? dollars : "********"}
                      </Typography.Text>
                      <Stack direction="horizontal" gap="4p" style={balanceCentStyle}>
                        <Typography.Text color="neutralBase-60" size="title3" weight="regular">
                          {balanceVisibility ? `.${cents}` ?? ".00" : ""}
                        </Typography.Text>
                        <Typography.Text color="neutralBase-60" size="title3" weight="regular">
                          {balanceVisibility ? t("Home.AccountDetails.Accounts.SAR") : ""}
                        </Typography.Text>
                      </Stack>
                    </Stack>
                  </Pressable>
                  <Pressable
                    style={showBalanceIconStyle}
                    onPress={() => toggleBalanceVisibility(!balanceVisibility)}
                    testID={testID !== undefined ? `${testID}-ToggleAccountBalanceButton` : undefined}>
                    {balanceVisibility ? <EyeShowIcon /> : <EyeHideIcon />}
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
            <Pressable
              style={styles.accountTextContainer}
              onPress={handleOnAccountDetailsPress}
              testID={testID !== undefined ? `${testID}-NavigateToAccountButton` : undefined}>
              <Stack direction="horizontal" align="center">
                <Typography.Text
                  color="neutralBase-30"
                  size="footnote"
                  weight="bold"
                  testID="Home.DashboardScreen:AccountNumber">
                  {accountNumber ? formatAccountNumber(accountNumber) : null}
                </Typography.Text>
                <Pressable
                  style={styles.iconContainer}
                  testID={testID !== undefined ? `${testID}-NavigateToAccountButton` : undefined}>
                  <NavigateToAccountIcon />
                </Pressable>
              </Stack>
            </Pressable>
            <Pressable
              style={[styles.iconContainer, showBalanceIconStyle]}
              onPress={handleOnCopyNumberPress}
              testID={testID !== undefined ? `${testID}-CopyNumberButton` : undefined}>
              <CopyAccountIcon />
            </Pressable>
          </Stack>
        </Stack>
      </BlurView>
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
