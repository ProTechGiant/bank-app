import { I18nManager, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack } from "@/components";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useThemeStyles } from "@/theme";

import { CurrenciesType } from "../types";
import FormattedPrice from "./FormattedPrice";

interface CurrencyListProps {
  onCurrencyClick: (currency: CurrenciesType) => void;
  currencies: CurrenciesType[];
}

export default function CurrenciesList({ currencies, onCurrencyClick }: CurrencyListProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const secondeTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
    color: "#78758A",
  }));

  const currencySymbolStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.caption1,
    color: "#1E1A25",
    marginHorizontal: theme.spacing["4p"],
  }));

  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
    color: "#1E1A25",
  }));

  return (
    <ScrollView testID="AllInOneCard.MyCurrenciesScreen:ScrollView">
      {currencies.map((currency, index) => (
        <Pressable
          key={index}
          onPress={() => onCurrencyClick(currency)}
          testID="AllInOneCard.MyCurrenciesScreen:Pressable">
          <Stack
            style={containerStyle}
            direction="horizontal"
            align="center"
            justify="space-between"
            gap="16p"
            key={index}>
            <Stack direction="horizontal" align="center" gap="12p" style={styles.currencyNameContainer}>
              <View style={styles.containerImage}>
                <SvgIcon uri={currency.CurrencyLogo || ""} width={25} height={25} />
              </View>
              <Stack direction="vertical">
                <Text style={mainTextStyle}>{currency.CurrencyCode}</Text>
                <Text style={secondeTextStyle}>{currency.CurrencyName}</Text>
              </Stack>
            </Stack>
            <Stack direction="horizontal" align="center" gap="8p">
              <Stack direction="horizontal" align="baseline" style={styles.rtl}>
                <FormattedPrice price={currency.CurrencyBalance || ""} />
                <Text style={currencySymbolStyle}>{currency.CurrencySymbol}</Text>
              </Stack>
              <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                <ChevronRightIcon color="#ACABBA" />
              </View>
            </Stack>
          </Stack>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerImage: {
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    height: 43,
    justifyContent: "center",
    width: 43,
  },
  currencyNameContainer: {
    width: "45%",
  },
  rtl: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});
