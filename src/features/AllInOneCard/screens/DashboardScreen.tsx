import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import SegmentedControlItem from "@/components/SegmentedControl/SegmentedControlItem";
import { useAuthContext } from "@/contexts/AuthContext";
import { useContentArticleList } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SettingIcon } from "../assets/icons";
import { NeraAdImage } from "../assets/images";
import { ActivateCard, Benefits, MoreFeatureModal, MyCurrencies, Rewards } from "../components";
import AllInCardPlaceholder from "../components/AllInCardPlaceholder";
import TransactionSection from "../components/TransactionSection";
import { AIO_CARD_TYPE, AIO_PRODUCT_TYPE, DEFAULT_LATEST_TRANSACTIONS, NERA_PLUS_CATEGORY_ID } from "../constants";
import { useAioCardDashboardDetail, useGetCardDetails, useGetCustomerSubscriptions } from "../hooks/query-hooks";
import { CardData, CardTypes, ContentCardType } from "../types";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const {
    allInOneCardStatus,
    allInOneCardType,
    setAllInOneCardType,
    otherAioCardProperties: { isConnectedToAppleWallet },
  } = useAuthContext();
  const navigation = useNavigation();
  //TODO : Satic value  will be removed when api works with all ids
  const { data: cardBalance } = useGetCardDetails({ id: "1", type: AIO_CARD_TYPE });
  const { data: cardDetail, isLoading: isAioCardLoading } = useAioCardDashboardDetail({
    ProductType: AIO_PRODUCT_TYPE,
    NoOfTransaction: DEFAULT_LATEST_TRANSACTIONS,
    IncludeTransactionsList: "true",
  });
  const { data: neraPlusData, isLoading: neraPlusIsLoading } = useContentArticleList(NERA_PLUS_CATEGORY_ID, true, true);
  const { data: customerSubscriptions, isLoading: subscriptionsIsLoading } = useGetCustomerSubscriptions(
    cardBalance?.CardIdentifierId ?? ""
  );

  const tabFeed = t("AllInOneCard.Dashboard.feed");
  const tabCurrencies = t("AllInOneCard.Dashboard.currencies");
  const [value, setValue] = useState(tabFeed);
  const { width } = useWindowDimensions();
  // TODO: activate card state will be managed from api in next build cycle
  const [showCardActivation, setShowCardActivation] = useState<boolean>(allInOneCardStatus === "inActive");
  const [hasAioCard, setHasAioCard] = useState<boolean>(false);
  const [visaData, setVisaData] = useState<CardData[]>();
  const [showMoreFeaturesModal, setShowMoreFeaturesModal] = React.useState(false);
  const isFocused = useIsFocused();

  const isNeraCard = allInOneCardType === CardTypes.NERA;
  const screenWidth = Dimensions.get("window").width;
  useEffect(() => {
    const extractTitleAndSubtitle = (dataArray: ContentCardType[]) => {
      return dataArray.map(item => ({
        title: item.Title,
        subTitle: item.SubTitle,
        iconUrl: item.Media[0].SourceFileURL,
      }));
    };

    if (neraPlusData) {
      const newAllInOneCard: CardData[] = [
        { benefits: extractTitleAndSubtitle(neraPlusData), cardType: CardTypes.NERA_PLUS },
      ];
      setVisaData(newAllInOneCard);
    }
  }, [neraPlusData]);

  useEffect(() => {
    //TODO: delay to mock api request time. Will be removed later when logic is based on the response of /aio-card api
    const timeOut = setTimeout(() => {
      if (isFocused) {
        if (allInOneCardStatus === "active") {
          setHasAioCard(true);
          setShowCardActivation(false);
        } else if (allInOneCardStatus === "inActive") {
          setHasAioCard(true);
          setShowCardActivation(true);
        } else {
          navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.EntryPoint" });
        }
      }
    }, 2000);
    return () => clearTimeout(timeOut);
  }, [allInOneCardStatus, isFocused, navigation]);

  const handleNavigateToSettings = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.SettingsScreen" });
  };

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    marginTop: theme.spacing["16p"],
  }));

  const neraAdBottomMargin = useThemeStyles<number>(theme => theme.spacing["16p"]);

  const styles = StyleSheet.create({
    activateCardStyle: {
      position: "absolute",
      start: width / 2.9,
      top: "20%",
    },
    loadingContainer: {
      flex: 1,
    },
  });

  const scrollStyle = useThemeStyles<ViewStyle>(() => ({
    opacity: 0.5,
  }));

  const styleSegmentedControl = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const handleUserSegment = (selectedValue: string) => {
    setValue(selectedValue);
  };

  const handleTransactionSeeMore = () =>
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.AllTransactionsScreen" });

  const handleAddToAppleWalletPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.AddToAppleWallet" });
  };

  const handleOnRewardsPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.Rewards",
      params: { cardType: allInOneCardType },
    });
  };

  const handleActivateCard = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.CreatePINScreen" });
  };

  const handleNeraAdPress = () => {
    setShowMoreFeaturesModal(true);
  };

  const handleOnApplyPress = () => {
    if (!visaData) return;
    setAllInOneCardType(visaData[0].cardType);
    setShowMoreFeaturesModal(false);
  };

  const imageWidth = screenWidth - 40;
  const aspectRatio = 177 / 353;
  const imageHeight = imageWidth * aspectRatio;
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette.primaryBase);

  return (
    <Page insets={["left", "right", "top"]} backgroundColor="neutralBase-60" testID="AllInOneCard.DashboardScreen:Page">
      {hasAioCard ? (
        <>
          <ScrollView style={showCardActivation ? scrollStyle : {}}>
            <View pointerEvents={showCardActivation ? "none" : "auto"}>
              <NavHeader
                withBackButton={false}
                title={t("AllInOneCard.Dashboard.title")}
                end={
                  <Pressable onPress={handleNavigateToSettings}>
                    <SettingIcon />
                  </Pressable>
                }
                backgroundColor={NavHeaderColor}
                testID="AllInOneCard.DashboardScreen:NavHeader"
              />
              <AllInCardPlaceholder
                variant={allInOneCardType}
                cardWidth="90%"
                visaCardData={cardBalance}
                onAddtoAppleWalletPress={handleAddToAppleWalletPress}
                isConnectedToAppleWallet={isConnectedToAppleWallet}
              />
              <View style={dividerStyle} />
              <View style={styleSegmentedControl}>
                <SegmentedControl value={value} onPress={selectedValue => handleUserSegment(selectedValue)}>
                  <SegmentedControlItem value={tabFeed}>{tabFeed}</SegmentedControlItem>
                  {/* TODO : hasUpdate Will be managed from api in next build cycle.currently we are just making ui  */}
                  <SegmentedControlItem value={tabCurrencies} hasUpdate={true}>
                    {tabCurrencies}
                  </SegmentedControlItem>
                </SegmentedControl>
              </View>
              {value === tabFeed ? (
                <>
                  {!isNeraCard && subscriptionsIsLoading ? (
                    <ActivityIndicator />
                  ) : customerSubscriptions?.PartnersList?.length === 0 ? (
                    <Benefits />
                  ) : null}
                  <Rewards onPress={handleOnRewardsPress} />
                  <TransactionSection
                    onPressSeeMore={handleTransactionSeeMore}
                    transactions={cardDetail?.Cards[0].Transaction}
                    isLoading={isAioCardLoading}
                  />
                  {!isNeraCard &&
                  !subscriptionsIsLoading &&
                  customerSubscriptions &&
                  customerSubscriptions.PartnersList?.length > 0 ? (
                    <Benefits customerSubscriptions={customerSubscriptions?.PartnersList} />
                  ) : null}

                  {neraPlusIsLoading ? (
                    <ActivityIndicator />
                  ) : isNeraCard ? (
                    <Pressable onPress={handleNeraAdPress}>
                      <Image
                        source={NeraAdImage}
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          width: imageWidth,
                          height: imageHeight,
                          resizeMode: "stretch",
                          alignSelf: "center",
                          marginBottom: neraAdBottomMargin,
                        }}
                      />
                    </Pressable>
                  ) : null}
                </>
              ) : (
                <MyCurrencies />
              )}
            </View>
          </ScrollView>
          {visaData !== undefined ? (
            <MoreFeatureModal
              isVisible={showMoreFeaturesModal}
              onClose={() => setShowMoreFeaturesModal(false)}
              item={visaData[0]}
              onPress={handleOnApplyPress}
              updateCard={true}
            />
          ) : null}
          {showCardActivation ? (
            <Pressable
              style={styles.activateCardStyle}
              onPress={handleActivateCard}
              testID="AllInOneCard.DashboardScreen:CardActivationButton">
              <ActivateCard label={t("AllInOneCard.Dashboard.activateCard")} backgroundColor="neutralBase-60" />
            </Pressable>
          ) : null}
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <FullScreenLoader />
        </View>
      )}
    </Page>
  );
}
