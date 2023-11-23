import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { CheckCircleFilledIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { FREE_WALLET_LIMIT_FOR_NERA, FREE_WALLET_LIMIT_FOR_NERA_PLUS } from "../constants";
import { defineCurrencies } from "../mocks";
import { CardTypes, CurrenciesType } from "../types";

export default function DefineCurrenciesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { allInOneCardType, myCurrencies } = useAuthContext();
  // TODO: will use this hook after api integration
  // const { data: currenciesList, isLoading } = useGetAllCurrencies();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<CurrenciesType[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<CurrenciesType[]>([]);
  const freeWalletLimit =
    allInOneCardType === CardTypes.NERA ? FREE_WALLET_LIMIT_FOR_NERA : FREE_WALLET_LIMIT_FOR_NERA_PLUS;
  const totalCurrencies = myCurrencies.length + selectedCurrencies.length;
  const availableCurrencies = defineCurrencies.filter(item => {
    return !myCurrencies.find(item2 => item2?.CurrencyCode === item.CurrencyCode);
  });
  useEffect(() => {
    setFilteredData(availableCurrencies);
  }, []);

  const selectCurrency = (currency: CurrenciesType) => {
    const isSelected = selectedCurrencies.find(item => item.CurrencyID === currency.CurrencyID);
    let newSelectedCurrencies = [];
    if (isSelected) {
      newSelectedCurrencies = selectedCurrencies.filter(item => item.CurrencyID !== currency.CurrencyID);
    } else {
      newSelectedCurrencies = [...selectedCurrencies, currency];
    }
    setSelectedCurrencies(newSelectedCurrencies);
  };

  const checkIfSelected = (id: string) => {
    return selectedCurrencies.find(item => item.CurrencyID === id);
  };

  const handleOnSubmit = () => {
    navigation.navigate("AllInOneCard.PaymentScreen", {
      selectedCurrencies: selectedCurrencies,
    });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const newData = availableCurrencies.filter(item => {
      const itemData = `${item.CurrencyName.toLowerCase()} ${item.CurrencyCode.toLowerCase()}`;
      return itemData.includes(text.toLowerCase());
    });
    setFilteredData(newData);
  };

  let buttonText = t("AllInOneCard.myCurrenciesScreens.amount");
  if (totalCurrencies <= freeWalletLimit && totalCurrencies > 0) {
    buttonText = t("AllInOneCard.myCurrenciesScreens.amountFree");
  }
  if (totalCurrencies > freeWalletLimit) {
    let paid = 0;
    if (myCurrencies.length > freeWalletLimit) {
      paid = selectedCurrencies.length * 15;
    } else {
      paid = (totalCurrencies - freeWalletLimit) * 15;
    }
    buttonText = t("AllInOneCard.myCurrenciesScreens.amountSAR", { amount: paid });
  }

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  const secondeTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes["body"],
    fontWeight: theme.typography.text.weights.medium,
    color: "#000",
  }));
  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes["title1"],
    fontWeight: theme.typography.text.weights.medium,
    color: "#1E1A25",
  }));
  const informationContainerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderRadius: theme.spacing["12p"],
    borderLeftWidth: theme.spacing["4p"],
    borderLeftColor: "#39FDDC",
    backgroundColor: theme.palette["supportBase-20"],
    alignItems: "flex-start",
  }));

  const informationTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.caption2,
    color: "#423D4A",
  }));

  const imageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderRadius: theme.spacing["16p"],
    height: 72,
    justifyContent: "center",
    width: 72,
    position: "relative",
  }));

  const searchContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const itemsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["8p"],
    flexWrap: "wrap",
  }));

  const itemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
    alignItems: "center",
  }));

  const textCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.caption1,
    color: "#000",
    textAlign: "center",
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.DefineCurrencies:Page">
      <NavHeader testID="AllInOneCard.DefineCurrencies:NavHeader" />
      <ContentContainer isScrollView>
        <Stack direction="vertical" style={headerContainerStyle} gap="20p">
          <Stack direction="vertical" gap="12p">
            {/* Todo: will remove Text tag and use Typography when the colors be in values file */}
            <Text style={mainTextStyle}>{t("AllInOneCard.myCurrenciesScreens.defineCurrencies")}</Text>
            {myCurrencies.length < freeWalletLimit ? (
              <Text style={secondeTextStyle}>
                {t("AllInOneCard.myCurrenciesScreens.defineCurrenciesDescription", {
                  noOfCurrencies: freeWalletLimit - myCurrencies.length,
                })}
              </Text>
            ) : null}
          </Stack>
          <View>
            <View style={searchContainerStyle}>
              <SearchInput
                placeholder={t("AllInOneCard.myCurrenciesScreens.search")}
                value={searchText}
                onSearch={handleSearch}
                onClear={() => {
                  setSearchText("");
                  setFilteredData(availableCurrencies);
                }}
                testID="AllInOneCard.DefineCurrencies:searchInput"
              />
            </View>
            {totalCurrencies > freeWalletLimit ? (
              <View style={informationContainerViewStyle}>
                {/* Todo: will remove Text tag and use Typography when the colors be in values file */}
                <Text style={informationTextStyle}>{t("AllInOneCard.myCurrenciesScreens.exceededMessage")}</Text>
              </View>
            ) : null}

            <Stack direction="horizontal" justify="space-between" style={itemsContainerStyle} gap="24p">
              {filteredData.map((item, index) => (
                <View key={index} style={itemContainerStyle}>
                  <Pressable
                    onPress={() => selectCurrency(item)}
                    style={[
                      imageContainerStyle,
                      { backgroundColor: checkIfSelected(item.CurrencyID) ? "#DCECEE" : "#F1F1F4" },
                    ]}>
                    <Image source={item.CurrencyLogo} style={styles.imageWidth} />
                    <View style={styles.checkCircleView}>
                      {checkIfSelected(item.CurrencyID) ? <CheckCircleFilledIcon color="#1D9158" /> : null}
                    </View>
                  </Pressable>
                  <View style={styles.textCurrencyContainer}>
                    {/* Todo: will remove Text tag and use Typography when the colors be in values file */}
                    <Text style={textCurrencyStyle}>
                      {item.CurrencyName} {item.CurrencyCode}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.textCurrencyContainer} />
            </Stack>
          </View>
        </Stack>
      </ContentContainer>
      <View style={buttonContainerStyle}>
        <Button onPress={handleOnSubmit} disabled={selectedCurrencies.length === 0}>
          {buttonText}
        </Button>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  checkCircleView: {
    bottom: -1,
    position: "absolute",
    right: -1,
  },
  imageWidth: {
    height: 45,
    width: 45,
  },
  textCurrencyContainer: {
    marginTop: 6,
    width: 86,
  },
});
