import { useTranslation } from "react-i18next";
import { Text, TextStyle, View, ViewStyle } from "react-native";

import { ErrorCircleIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { FREE_WALLET_LIMIT_FOR_NERA, FREE_WALLET_LIMIT_FOR_NERA_PLUS } from "../constants";
import { CardTypes } from "../types";

export default function NoCurrencies() {
  const { t } = useTranslation();
  const { allInOneCardType } = useAuthContext();
  const navigation = useNavigation();
  const freeWalletLimit =
    allInOneCardType === CardTypes.NERA ? FREE_WALLET_LIMIT_FOR_NERA : FREE_WALLET_LIMIT_FOR_NERA_PLUS;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["20p"],
  }));
  const secondeTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes["footnote"],
    fontWeight: theme.typography.text.weights.medium,
    color: "#78758A",
    textAlign: "center",
  }));
  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes["callout"],
    fontWeight: theme.typography.text.weights.medium,
    color: "#2C2636",
    textAlign: "center",
  }));

  return (
    <Stack style={containerStyle} direction="vertical" justify="center" align="center" gap="16p">
      <ErrorCircleIcon color="#000" />
      <View>
        <Text style={mainTextStyle}>{t("AllInOneCard.myCurrenciesScreens.noCurrencies")}</Text>
        <Text style={secondeTextStyle}>
          {t("AllInOneCard.myCurrenciesScreens.noCurrenciesDescription", { noOfCurrencies: freeWalletLimit })}
        </Text>
      </View>
      <Button
        variant="primary-warning"
        size="mini"
        onPress={() =>
          navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.DefineCurrenciesScreen" })
        }>
        {t("AllInOneCard.myCurrenciesScreens.addCurrency")}
      </Button>
    </Stack>
  );
}
