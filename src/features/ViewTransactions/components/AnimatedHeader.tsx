import { useTranslation } from "react-i18next";
import { Animated, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { SpendingInsightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useThemeStyles } from "@/theme";

interface AnimatedHeaderProps {
  headerProps: {
    height: Animated.Value;
    currFont: Animated.Value;
    sarFont: Animated.Value;
    iconSize: Animated.Value;
    flexDir: string;
  };
  isFiltered?: boolean;
  isFilterDisabled?: boolean;
  onPress?: () => void;
}

const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });

export default function AnimatedHeader({ headerProps, isFilterDisabled, onPress }: AnimatedHeaderProps) {
  const { t } = useTranslation();
  const account = useCurrentAccount();
  const { height, currFont, sarFont, flexDir } = headerProps;

  const balance = account.data?.balance ?? 0;
  const formattedBalance = formatter.format(balance);
  const [dollars, cents] = formattedBalance.split(".");

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-40"],
      paddingHorizontal: theme.spacing["20p"],
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }),
    [height]
  );

  const currencyStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+30"],
      marginRight: theme.spacing["4p"],
      textAlign: "left",
      fontWeight: theme.typography.text.weights.medium,
    }),
    [currFont]
  );

  const sarStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+10"],
      paddingBottom: theme.spacing["4p"],
      textAlign: "left",
      fontWeight: theme.typography.text.weights.regular,
    }),
    [sarFont]
  );

  const centStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+30"],
      paddingBottom: 2,
      textAlign: "left",
      fontWeight: theme.typography.text.weights.regular,
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

  const disabledFilter = useThemeStyles<ViewStyle>(
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

  return (
    <Animated.View style={[headerStyle, { height: height }]}>
      <View>
        <Typography.Text style={balanceStyle} color="neutralBase+10">
          {t("ViewTransactions.TransactionsScreen.balance")}
        </Typography.Text>
        <View style={amountContainer}>
          <Animated.Text style={[currencyStyle, { fontSize: currFont }]}>
            {dollars ?? 0}
            <Animated.Text style={[centStyle, { fontSize: sarFont }]}>{`.${cents}` ?? 0.0}</Animated.Text>
          </Animated.Text>
          <Animated.Text style={[sarStyle, { fontSize: sarFont }]}>
            {" " + (account.data?.currencyType ?? t("ViewTransactions.TransactionsScreen.sar"))}
          </Animated.Text>
        </View>
        <Typography.Text color="neutralBase+10" size="footnote" weight="semiBold">
          {account.data?.name ?? "-"}
        </Typography.Text>
      </View>
      <Pressable style={disabledFilter} onPress={onPress}>
        <SpendingInsightIcon />
      </Pressable>
    </Animated.View>
  );
}
