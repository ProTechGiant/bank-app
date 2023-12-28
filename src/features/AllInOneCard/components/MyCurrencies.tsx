import { useTranslation } from "react-i18next";
import { Pressable, Text, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useGetCustomerCurrencies } from "../hooks/query-hooks";
import { CurrenciesType } from "../types";
import CurrenciesList from "./CurrenciesList";
import NoCurrencies from "./NoCurrencies";

export default function MyCurrencies() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    otherAioCardProperties: { aioCardId },
  } = useAuthContext();

  const { data: customerCurrencies, isLoading } = useGetCustomerCurrencies(aioCardId ?? "");
  const { allInOneCardType } = useAuthContext();

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

  const loaderContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["64p"],
  }));

  return isLoading ? (
    <View style={loaderContainerStyle}>
      <FullScreenLoader />
    </View>
  ) : (
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
      {customerCurrencies?.CurrenciesList !== undefined && customerCurrencies?.CurrenciesList.length > 0 ? (
        <CurrenciesList
          currencies={customerCurrencies?.CurrenciesList.filter(c => c.CurrencyCode !== "SAR")}
          onCurrencyClick={id => handleCurrencyPress(id)}
        />
      ) : (
        <NoCurrencies />
      )}
    </Stack>
  );
}
