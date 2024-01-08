import { useTranslation } from "react-i18next";
import { Animated, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { SpendingInsightIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface AnimatedHeaderProps {
  headerProps: {
    height: Animated.Value;
    currFont: Animated.Value;
    sarFont: Animated.Value;
    iconSize: Animated.Value;
    flexDir: string;
  };
  isFilterDisabled?: boolean;
  isIconsDisabled?: boolean;
  onPress?: () => void;
  testID: string;
}

const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });

export default function AnimatedHeader({
  headerProps,
  isFilterDisabled,
  testID,
  isIconsDisabled,
}: AnimatedHeaderProps) {
  const { t } = useTranslation();
  const account = useCurrentAccount();
  const { currFont, sarFont, iconSize, flexDir } = headerProps;
  const navigation = useNavigation();

  const balance = account.data?.balance ?? 0;
  const formattedBalance = formatter.format(balance);
  const [dollars, cents] = formattedBalance.split(".");

  const handleOnTopSpendingInsights = () => {
    navigation.navigate("TopSpending.TopSpendingStack", {
      screen: "TopSpending.TopSpendingScreen",
    });
  };

  const currencyStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-60"],
      marginRight: theme.spacing["4p"],
      textAlign: "left",
      fontWeight: theme.typography.text.weights.medium,
    }),
    [currFont]
  );

  const sarStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-10"],
      paddingBottom: theme.spacing["4p"],
      textAlign: "left",
      fontWeight: theme.typography.text.weights.regular,
    }),
    [sarFont]
  );

  const centStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-60"],
      marginRight: theme.spacing["4p"],
      textAlign: "left",
      fontWeight: theme.typography.text.weights.medium,
    }),
    [sarFont]
  );

  const balanceStyle = useThemeStyles<TextStyle>(
    theme => ({
      display: flexDir === "row-reverse" ? "none" : "flex",
      fontSize: theme.typography.text.sizes.footnote,
      fontWeight: theme.typography.text.weights.regular,
      textAlign: "left",
      marginVertical: theme.spacing["4p"],
    }),
    [flexDir]
  );

  const disabledFilterStyle = useThemeStyles<ViewStyle>(
    () => ({
      alignSelf: "flex-end",
    }),
    [isFilterDisabled]
  );

  const amountContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: theme.spacing["4p"],
  }));

  const filterIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette.neutralBaseHover,
      borderRadius: theme.radii.medium,
      marginBottom: theme.spacing["4p"],
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }),
    [iconSize]
  );

  const reSizeStyle = useThemeStyles<ViewStyle>(
    () => ({
      transform: [{ scale: flexDir === "column" ? 1 : 0.84 }],
    }),
    [iconSize, flexDir]
  );

  const filterButtonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: flexDir === "row-reverse" ? "row-reverse" : "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing["12p"],
    }),
    [flexDir]
  );

  const emptyViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  const iconsColor = useThemeStyles(theme => theme.palette["primaryBase-70"]);

  const iconsDisabledColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <Animated.View>
      <Stack direction="horizontal" justify="space-between" align="flex-end">
        <View>
          <Typography.Text style={balanceStyle} size="footnote" weight="regular" color="neutralBase-10">
            {t("ViewTransactions.TransactionsScreen.balance")}
          </Typography.Text>
          <View style={amountContainer} testID={`${testID}:AccountBalance`}>
            <Animated.Text style={[currencyStyle, { fontSize: currFont }]}>
              {dollars ?? 0}
              <Animated.Text style={[centStyle, { fontSize: currFont }]}>{`.${cents}` ?? 0.0}</Animated.Text>
            </Animated.Text>
            <Animated.Text style={[sarStyle, { fontSize: sarFont }]}>
              {" " + (account.data?.currencyType ?? t("Currency.sar"))}
            </Animated.Text>
          </View>
          <Typography.Text color="neutralBase-10" size="footnote" weight="regular" testID={`${testID}:AccountName`}>
            {t("ViewTransactions.TransactionsScreen.currentAccount")}
          </Typography.Text>
        </View>
        <Stack direction="horizontal" gap="8p" align="center">
          <Pressable
            style={disabledFilterStyle}
            onPress={() => {
              if (!isIconsDisabled) handleOnTopSpendingInsights();
            }}
            disabled={isFilterDisabled}
            testID={`${testID}:FiltersButton`}>
            <View style={filterButtonStyle}>
              <Animated.View style={[filterIconStyle, { width: iconSize, height: iconSize }]}>
                <Animated.View style={reSizeStyle}>
                  <SpendingInsightIcon color={isIconsDisabled ? iconsDisabledColor : iconsColor} />
                </Animated.View>
              </Animated.View>
              <View style={emptyViewStyle} />
            </View>
          </Pressable>
        </Stack>
      </Stack>
    </Animated.View>
  );
}
