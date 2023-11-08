import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Typography } from "@/components";
import Button from "@/components/Button";
import { Carousel } from "@/components/Carousel";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { useContentArticleList } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { useTheme, useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { Card, MoreFeatureModal } from "../components";
import { useAllInOneCardContext } from "../contexts/AllInOneCardContext";
import { useGetProducts } from "../hooks/query-hooks";
import { cardData } from "../mocks";
import { CardData, CardTypes, ContentCardType } from "../types";

export default function SelectCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { data: products, isLoading: productsIsLoading } = useGetProducts();

  const neraCategoryId = products?.ProductList?.ProductCodesList.find(
    item => item.ProductName === CardTypes.NERA
  )?.ProductCode;
  const neraPlusCategoryId = products?.ProductList?.ProductCodesList.find(
    item => item.ProductName === CardTypes.NERA_PLUS
  )?.ProductCode;

  const { data: neraData, isLoading: neraIsLoading } = useContentArticleList(neraCategoryId || "", true, true);
  const { data: neraPlusData, isLoading: neraPlusIsLoading } = useContentArticleList(
    neraPlusCategoryId || "",
    true,
    true
  );

  const [visaData, setVisaData] = useState<CardData[]>(cardData);

  useEffect(() => {
    const extractTitleAndSubtitle = (dataArray: ContentCardType[]) => {
      return dataArray.map(item => ({
        title: item.Title,
        subTitle: item.SubTitle,
        iconUrl: item.Media[0].SourceFileURL,
      }));
    };

    if (neraPlusData && neraData) {
      // TOTO: some of the data is missing, so we need to use mock data for now
      const newAllInOneCard = [
        { ...cardData[0], benefits: extractTitleAndSubtitle(neraPlusData) },
        { ...cardData[1], benefits: extractTitleAndSubtitle(neraData) },
      ];

      setVisaData(newAllInOneCard);
    }
  }, [neraData, neraPlusData]);

  const { setContextState } = useAllInOneCardContext();
  const { setAllInOneCardType } = useAuthContext();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showMoreFeaturesModal, setShowMoreFeaturesModal] = React.useState(false);

  const handleOnApplyPress = () => {
    setContextState({
      cardType: cardData[activeIndex].cardType,
    });
    setAllInOneCardType(cardData[activeIndex].cardType);
    setShowMoreFeaturesModal(false);
    delayTransition(() => {
      navigation.navigate("AllInOneCard.ChooseRedemptionMethod");
    });
  };
  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["4p"],
  }));

  const pressableStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginBottom: theme.spacing["16p"],
  }));

  const buttonsViewContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: 70,
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page>
      <View style={styles.container}>
        <View style={styles.header}>
          <NavHeader title="All in One" variant="white" />
          <View style={textContainerStyle}>
            <Typography.Header size="medium" weight="bold" align="center" color="neutralBase-60">
              {t("AllInOneCard.SelectedCardScreen.pickedCard")}
            </Typography.Header>
          </View>
        </View>
        {neraPlusIsLoading || neraIsLoading || productsIsLoading ? (
          <FullScreenLoader />
        ) : (
          <>
            <View style={styles.carouselContainer}>
              <Carousel
                width={326}
                data={visaData}
                Slide={data => <Card data={data.data} />}
                onChangeIndex={setActiveIndex}
                contentContainerStyle={contentContainerStyle}
              />
            </View>
            <View style={buttonsViewContainerStyle}>
              <Pressable
                onPress={() => setShowMoreFeaturesModal(true)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, pressableStyle]}>
                <Typography.Text size="body" weight="medium" color="successBase">
                  {t("AllInOneCard.SelectedCardScreen.showButton")}
                </Typography.Text>
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ChevronRightIcon color={theme.palette.successBase} />
                </View>
              </Pressable>
              <Button onPress={handleOnApplyPress}>{t("AllInOneCard.SelectedCardScreen.apply")}</Button>
            </View>
          </>
        )}

        <MoreFeatureModal
          isVisible={showMoreFeaturesModal}
          onClose={() => setShowMoreFeaturesModal(false)}
          item={visaData[activeIndex]}
          onPress={handleOnApplyPress}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: "absolute",
    top: 90,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  header: {
    backgroundColor: "#2E2A34",
    flex: 0.5,
  },
});
