import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, I18nManager, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { NoRewardIcon, PaidIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CurrenciesList from "../components/CurrenciesList";
import {
  DIFFERENCE_BETWEEN_NERA_PLUS_AND_NERA,
  FREE_WALLET_LIMIT_FOR_NERA,
  FREE_WALLET_LIMIT_FOR_NERA_PLUS,
} from "../constants";
import { CardTypes } from "../types";

export default function MyCurrenciesScreen() {
  const { t } = useTranslation();
  const { myCurrencies, allInOneCardType } = useAuthContext();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(myCurrencies);
  const freeWalletLimit =
    allInOneCardType === CardTypes.NERA ? FREE_WALLET_LIMIT_FOR_NERA : FREE_WALLET_LIMIT_FOR_NERA_PLUS;
  const screenWidth = Dimensions.get("window").width;

  const handleSearch = (text: string) => {
    setSearchText(text);
    const newData = myCurrencies.filter(item => {
      const itemData = `${item.currencyName.toLowerCase()} ${item.currencyCode.toLowerCase()}`;
      return itemData.includes(text.toLowerCase());
    });
    setFilteredData(newData);
  };

  const addNewCurrency = () => {
    navigation.navigate("AllInOneCard.DefineCurrenciesScreen");
  };

  const secondeTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.footnote,
    fontWeight: theme.typography.text.weights.medium,
    color: "#78758A",
    marginBottom: theme.spacing["4p"],
  }));
  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
    color: "#1E1A25",
    marginTop: theme.spacing["8p"],
  }));
  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.title1,
    fontWeight: theme.typography.text.weights.bold,
    color: "#01322A",
    paddingHorizontal: theme.spacing["24p"],
    paddingVertical: theme.spacing["24p"],
  }));
  const informationContainerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    width: screenWidth - 40,
    padding: theme.spacing["16p"],
    borderRadius: theme.spacing["12p"],
    borderLeftWidth: theme.spacing["4p"],
    borderLeftColor: "#39FDDC",
    backgroundColor: "#EEF6F7",
    alignItems: "flex-start",
    marginTop: 40,
  }));

  const informationTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.caption1,
    color: "#1E1A25",
    fontStyle: "italic",
    fontWeight: theme.typography.text.weights.medium,
  }));

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: theme.spacing["20p"],
  }));
  return (
    <Page>
      <NavHeader
        end={<NavHeader.AddButton onPress={addNewCurrency} />}
        onBackPress={() => {
          navigation.navigate("Home.HomeTabs", { screen: "Cards" });
        }}
      />
      <View>
        <Text style={titleStyle}>{t("AllInOneCard.myCurrenciesScreens.myCurrenciesTitle")}</Text>
      </View>
      {myCurrencies.length > 0 ? (
        <View style={listContainerStyle}>
          <View>
            <SearchInput
              placeholder={t("AllInOneCard.myCurrenciesScreens.search")}
              value={searchText}
              onSearch={handleSearch}
              onClear={() => {
                setSearchText("");
                setFilteredData(myCurrencies);
              }}
            />
            <CurrenciesList currencies={filteredData} />
          </View>
          <Button variant="tertiary" iconLeft={<PaidIcon />} onPress={addNewCurrency}>
            {t("AllInOneCard.myCurrenciesScreens.addCurrencyButton")}
          </Button>
        </View>
      ) : (
        <Stack style={styles.container} direction="vertical" justify="center" align="center" gap="8p">
          <NoRewardIcon />
          <Text style={mainTextStyle}>{t("AllInOneCard.myCurrenciesScreens.noCurrencies")}</Text>
          <Text style={secondeTextStyle}>
            {t("AllInOneCard.myCurrenciesScreens.noCurrenciesDescription", { noOfCurrencies: freeWalletLimit })}
          </Text>
          <Button variant="primary-warning" size="mini" onPress={addNewCurrency}>
            {t("AllInOneCard.myCurrenciesScreens.addCurrency")}
          </Button>
          {allInOneCardType === CardTypes.NERA ? (
            <View style={informationContainerViewStyle}>
              <Text style={informationTextStyle}>
                {t("AllInOneCard.myCurrenciesScreens.youWillGet")}
                <Text style={styles.neraText}>{I18nManager.isRTL ? null : DIFFERENCE_BETWEEN_NERA_PLUS_AND_NERA}</Text>
                {t("AllInOneCard.myCurrenciesScreens.freeCurrency")} <Text style={styles.neraText}>+nera </Text>Plus
                <Text style={styles.updateText}>{t("AllInOneCard.myCurrenciesScreens.upgradeNow")}</Text>
              </Text>
            </View>
          ) : null}
        </Stack>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    top: "15%",
  },
  neraText: {
    fontStyle: "normal",
    fontWeight: "600",
  },
  updateText: {
    color: "#EC5F48",
    fontStyle: "normal",
    textDecorationLine: "underline",
  },
});
