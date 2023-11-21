import { I18nManager, Image, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack } from "@/components";
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
    <ScrollView>
      {currencies.map((currency, index) => (
        <Pressable key={index} onPress={() => onCurrencyClick(currency)}>
          <Stack
            style={containerStyle}
            direction="horizontal"
            align="center"
            justify="space-between"
            gap="16p"
            key={index}>
            <Stack direction="horizontal" align="center" gap="16p" style={{ width: "65%" }}>
              <View style={styles.containerImage}>
                <Image source={currency.currencyImage} style={styles.imageWidth} />
              </View>
              <Stack direction="vertical">
                <Text style={mainTextStyle}>{currency.currencyCode}</Text>
                <Text style={secondeTextStyle}>
                  {I18nManager.isRTL ? currency.currencyNameAr : currency.currencyName}
                </Text>
              </Stack>
            </Stack>
            <Stack direction="horizontal" align="center" gap="12p">
              <Stack direction="horizontal" align="baseline" style={styles.rtl}>
                <FormattedPrice price="20.3" />
                <Text style={currencySymbolStyle}>{currency.currencySymbol}</Text>
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
  imageWidth: {
    height: 25,
    width: 25,
  },
  rtl: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});
