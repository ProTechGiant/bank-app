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
  //TODO: will remove this mock data when api ready
  const { data: customerCurrencies, isLoading } = useGetCustomerCurrencies("1561d940-49e7-4a38-8b7f-fc41adc0e09a");
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
          currencies={customerCurrencies?.CurrenciesList}
          onCurrencyClick={id => handleCurrencyPress(id)}
        />
      ) : (
        <NoCurrencies />
      )}
    </Stack>
  );
}
