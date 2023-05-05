import React from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useThemeStyles } from "@/theme";

interface AnimatedHeaderProps {
  setIsViewingFilter: (isViewing: boolean) => void;
  headerProps: {
    height: Animated.Value;
    currFont: Animated.Value;
    sarFont: Animated.Value;
    iconSize: Animated.Value;
    flexDir: string;
  };
  isFiltered?: boolean;
  isFilterDisabled?: boolean;
}

const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });

export default function AnimatedHeader({
  setIsViewingFilter,
  headerProps,
  isFiltered,
  isFilterDisabled,
}: AnimatedHeaderProps) {
  const { t } = useTranslation();
  const account = useCurrentAccount();
  const { height, currFont, sarFont, iconSize, flexDir } = headerProps;

  const balance = account.data?.balance ?? 0;
  const formattedBalance = formatter.format(balance);
  const [dollars, cents] = formattedBalance.split(".");

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      width: "100%",
      backgroundColor: theme.palette.primaryBase,
      paddingBottom: theme.spacing["12p"],
      paddingHorizontal: theme.spacing["10p"],
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }),
    [height]
  );

  const filterIcon = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-40"],
      borderRadius: theme.radii.xxlarge,
      marginBottom: theme.spacing["5p"],
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }),
    [iconSize]
  );

  const reSize = useThemeStyles<ViewStyle>(
    () => ({
      transform: [{ scale: flexDir === "column" ? 1 : 0.6 }],
    }),
    [iconSize, flexDir]
  );

  const currencyStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-50"],
      marginRight: theme.spacing["5p"],
      textAlign: "left",
      fontWeight: "bold",
    }),
    [currFont]
  );

  const sarStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["primaryBase-40"],
      paddingBottom: theme.spacing["4p"],
      textAlign: "left",
      fontWeight: theme.typography.text.weights.regular,
    }),
    [sarFont]
  );

  const centStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-50"],
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
      marginVertical: theme.spacing["5p"],
    }),
    [flexDir]
  );

  const filterButton = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: flexDir === "row-reverse" ? "row-reverse" : "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing["10p"],
    }),
    [flexDir]
  );

  const disabledFilter = useThemeStyles<ViewStyle>(
    () => ({
      opacity: isFilterDisabled ? 0.5 : 1,
    }),
    [isFilterDisabled]
  );

  const amountContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: theme.spacing["5p"],
  }));

  const circle = useThemeStyles<ViewStyle>(
    theme => ({
      position: "absolute",
      top: flexDir === "column" ? 4 : 0,
      right: flexDir === "column" ? 4 : 0,
      width: flexDir === "column" ? 8 : 7,
      height: flexDir === "column" ? 8 : 7,
      borderRadius: theme.radii.extraSmall,
      borderColor: theme.palette.primaryBase,
      borderWidth: 1,
      backgroundColor: theme.palette.complimentBase,
    }),
    [flexDir]
  );

  const emptyView = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  const { filterColor } = useThemeStyles(theme => ({
    filterColor: theme.palette["primaryBase-40"],
  }));

  return (
    <Animated.View style={[headerStyle, { height: height }]}>
      <View>
        <Typography.Text style={balanceStyle} color="primaryBase-40">
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
        <Typography.Text color="primaryBase-40" size="footnote" weight="semiBold">
          {account.data?.name ?? "-"}
        </Typography.Text>
      </View>
      <Pressable style={disabledFilter} onPress={() => setIsViewingFilter(true)} disabled={isFilterDisabled}>
        <View style={filterButton}>
          <Animated.View style={[filterIcon, { width: iconSize, height: iconSize }]}>
            <Animated.View style={reSize}>
              <FilterIcon color={filterColor} height={25} width={25} />
            </Animated.View>
            {isFiltered ? <View style={circle} /> : null}
          </Animated.View>
          <View style={emptyView} />
          <Typography.Text color="neutralBase-50" size="footnote" weight="semiBold">
            {t("ViewTransactions.TransactionsScreen.filter")}
          </Typography.Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
