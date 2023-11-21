import { useTranslation } from "react-i18next";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CurrenciesType } from "../types";
import CurrenciesList from "./CurrenciesList";
import NoCurrencies from "./NoCurrencies";

export default function MyCurrencies() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { myCurrencies, allInOneCardType } = useAuthContext();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["20p"],
  }));
  const textStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.footnote,
    fontWeight: theme.typography.text.weights.medium,
    color: "#78758A",
  }));

  const handleCurrencyPress = (currencySelected: CurrenciesType) => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.transactionDetail",
      params: { cardType: allInOneCardType, currency: currencySelected },
    });
  };

  return (
    <Stack style={containerStyle} direction="vertical" align="stretch">
      <Stack direction="horizontal" align="center" justify="space-between">
        <Typography.Text size="title2" weight="medium">
          {t("AllInOneCard.myCurrenciesScreens.myCurrencies")}
        </Typography.Text>
        <Pressable
          onPress={() => {
            navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.MyCurrenciesScreen" });
          }}>
          <Text style={textStyle}>{t("AllInOneCard.Dashboard.viewAll")}</Text>
        </Pressable>
      </Stack>
      {myCurrencies.length > 0 ? (
        <CurrenciesList currencies={myCurrencies} onCurrencyClick={id => handleCurrencyPress(id)} />
      ) : (
        <NoCurrencies />
      )}
    </Stack>
  );
}
