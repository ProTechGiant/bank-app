import { useTranslation } from "react-i18next";
import { Animated, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useThemeStyles } from "@/theme";

interface AnimatedHeaderProps {
  onChangeIsViewingFilter: (isViewing: boolean) => void;
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

export default function AnimatedHeader({
  onChangeIsViewingFilter,
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
      backgroundColor: theme.palette["supportBase-15"],
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
      backgroundColor: theme.palette["neutralBase-60"],
      borderRadius: theme.radii.xxlarge,
      marginBottom: theme.spacing["4p"],
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }),
    [iconSize]
  );

  const reSizeStyle = useThemeStyles<ViewStyle>(
    () => ({
      transform: [{ scale: flexDir === "column" ? 1 : 0.6 }],
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

  const circleStyle = useThemeStyles<ViewStyle>(
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

  const emptyViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  const filterColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

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
            {" " + (account.data?.currencyType ?? t("Currency.sar"))}
          </Animated.Text>
        </View>
        <Typography.Text color="neutralBase+10" size="footnote" weight="semiBold">
          {account.data?.name ?? "-"}
        </Typography.Text>
      </View>
      <Pressable style={disabledFilterStyle} onPress={() => onChangeIsViewingFilter(true)} disabled={isFilterDisabled}>
        <View style={filterButtonStyle}>
          <Animated.View style={[filterIconStyle, { width: iconSize, height: iconSize }]}>
            <Animated.View style={reSizeStyle}>
              <FilterIcon color={filterColor} height={25} width={25} />
            </Animated.View>
            {isFiltered ? <View style={circleStyle} /> : null}
          </Animated.View>
          <View style={emptyViewStyle} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
