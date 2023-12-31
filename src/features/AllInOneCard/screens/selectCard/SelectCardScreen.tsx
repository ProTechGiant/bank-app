import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";

import { Carousel } from "@/components/Carousel";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { useContentArticleList } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { Card } from "../../components";
import { NERA_CATEGORY_ID, NERA_PLUS_CATEGORY_ID, PAYMENT_METHOD_ANNUAL } from "../../constants";
import { useAllInOneCardContext } from "../../contexts/AllInOneCardContext";
import { useGetAllPartners, useGetPaymentsMethod, useGetProducts } from "../../hooks/query-hooks";
import { CardData, CardTypes, ContentCardType } from "../../types";

export default function SelectCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: products, isLoading: productsIsLoading } = useGetProducts();
  const { data: neraData, isLoading: neraIsLoading } = useContentArticleList(NERA_CATEGORY_ID, true, true);
  const { data: neraPlusData, isLoading: neraPlusIsLoading } = useContentArticleList(NERA_PLUS_CATEGORY_ID, true, true);
  const productId = products?.ProductList?.ProductCodesList.filter(item => item.ProductName !== CardTypes.NERA)[0]
    .ProductId;
  const { data: paymentsMethod, isLoading: paymentsMethodIsLoading } = useGetPaymentsMethod({
    productId: productId || "",
    channelId: "1",
  });

  const { setContextState } = useAllInOneCardContext();
  const { data: partnersBenefits, isLoading: partnersBenefitsIsLoading } = useGetAllPartners();
  const { setAllInOneCardType } = useAuthContext();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [visaData, setVisaData] = useState<CardData[]>();
  const screenWidth = Dimensions.get("window").width;
  const yearlyFee = paymentsMethod?.PricePlans.filter(item => item.Code === PAYMENT_METHOD_ANNUAL)[0]?.Fees;
  const monthlyFee = paymentsMethod?.PricePlans.filter(item => item.Code !== PAYMENT_METHOD_ANNUAL)[0]?.Fees;

  useEffect(() => {
    const extractTitleAndSubtitle = (dataArray: ContentCardType[]) => {
      return dataArray.map(item => ({
        title: item.Title,
        subTitle: item.SubTitle,
        iconUrl: item.Media[0].SourceFileURL,
      }));
    };

    if (neraPlusData && neraData && yearlyFee && monthlyFee && partnersBenefits) {
      const newAllInOneCard: CardData[] = [
        {
          benefits: extractTitleAndSubtitle(neraPlusData),
          cardType: CardTypes.NERA_PLUS,
          yearlyFee: yearlyFee,
          monthlyFee: monthlyFee,
          partnersBenefits: partnersBenefits?.PartnersList,
        },
        { benefits: extractTitleAndSubtitle(neraData), cardType: CardTypes.NERA },
      ];

      setVisaData(newAllInOneCard);
    }
  }, [neraData, neraPlusData, yearlyFee, monthlyFee]);

  const handleOnApplyPress = () => {
    if (!visaData) return;
    const isNera = visaData[activeIndex].cardType === CardTypes.NERA;
    const product = products?.ProductList?.ProductCodesList.filter(item =>
      isNera ? item.ProductName === CardTypes.NERA : item.ProductName !== CardTypes.NERA
    )[0];
    setContextState({
      cardType: visaData[activeIndex].cardType,
      productId: product?.ProductId,
      productCode: product?.ProductCode,
    });
    setAllInOneCardType(visaData[activeIndex].cardType);
    delayTransition(() => {
      navigation.navigate("AllInOneCard.ChooseRedemptionMethod");
    });
  };

  const navBackButtonColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page testID="AllInOneCard.SelectCardScreen:Page" backgroundColor="primaryBase">
      <NavHeader
        title={t("AllInOneCard.SelectedCardScreen.cards")}
        testID="AllInOneCard.SelectCardScreen:NavHeader"
        onBackPress={() => navigation.goBack()}
        backgroundAngledColor={navBackButtonColor}
      />
      {neraIsLoading ||
      neraPlusIsLoading ||
      paymentsMethodIsLoading ||
      partnersBenefitsIsLoading ||
      productsIsLoading ? (
        <FullScreenLoader />
      ) : visaData !== undefined ? (
        <View style={styles.container}>
          <Carousel
            width={screenWidth}
            data={visaData}
            Slide={data => <Card step={activeIndex} visaData={data.data} onApplyPress={handleOnApplyPress} />}
            onChangeIndex={setActiveIndex}
          />
        </View>
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
