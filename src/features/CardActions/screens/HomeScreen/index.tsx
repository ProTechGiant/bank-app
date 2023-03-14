import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, ViewStyle } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { InfoCircleIcon, ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams, CardStatus } from "../../CardActionsStack";
import ViewPinModal from "../../components/ViewPinModal";
import { useCards, useCustomerTier, useFreezeCard, useUnfreezeCard } from "../../query-hooks";

interface ContextMenuItem {
  id: number;
  title: string;
  systemIcon?: string;
  disabled?: boolean;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data } = useCards();
  const customerTier = useCustomerTier();

  const cardsList = data?.Cards;
  const singleUseCard = cardsList?.find(card => card?.CardType === SINGLE_USE_CARD_TYPE);

  const freezeCardAsync = useFreezeCard();
  const unfreezeCardAsync = useUnfreezeCard();

  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.HomeScreen">>();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(
    route.params?.action === "view-pin" && route.params?.action !== undefined
  );
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const isFreezeCardActive = true; // @TODO BE integration
  const isViewingPinActive = true; // @TODO BE integration

  useEffect(() => {
    setIsViewingPin(route.params?.action === "view-pin");
    if (route.params?.action === "unfreeze") {
      setIsCardFrozen(false);
    } else if (route.params?.action === "freeze") {
      setIsCardFrozen(true);
    }
  }, [route.params]);

  const contextMenuActions: ContextMenuItem[] = [
    {
      id: 1,
      title: isCardFrozen ? t("CardActions.QuickMenu.defrost") : t("CardActions.QuickMenu.freezeCard"),
      systemIcon: isCardFrozen ? "thermometer.snowflake" : "snowflake",
      disabled: !isFreezeCardActive,
    },
    {
      id: 2,
      title: t("CardActions.QuickMenu.viewPin"),
      systemIcon: "lock",
      disabled: !isViewingPinActive,
    },
    {
      id: 3,
      title: t("CardActions.QuickMenu.settings"),
      systemIcon: "gearshape",
    },
  ];

  const handleOnFreezeCardPress = async (cardId: string) => {
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId });
      response.Status === "freeze" ? setIsCardFrozen(true) : setShowErrorModal(true);
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async (cardId: string) => {
    try {
      const response = await unfreezeCardAsync.mutateAsync({ cardId });
      if (response.OtpCode !== undefined && response.OtpId !== undefined) {
        navigation.navigate("CardActions.OneTimePasswordModal", {
          redirect: "CardActions.HomeScreen",
          action: "unfreeze",
          otpId: response.OtpId,
          otpCode: response.OtpCode,
        });
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleOnViewPinPress = () => {
    navigation.navigate("CardActions.OneTimePasswordModal", { redirect: "CardActions.HomeScreen", action: "view-pin" });
  };

  const handleOnCardSettingsPress = (cardStatus: CardStatus) => {
    navigation.navigate("CardActions.CardSettingsScreen", {
      cardStatus: cardStatus,
    });
  };

  const handleOnActiveCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", {
      cardType: "standard",
      cardStatus: "active",
      cardId: cardId,
    });
  };

  const handleOnInactiveCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", {
      cardType: "standard",
      cardStatus: "inactive",
      cardId: cardId,
    });
  };

  const handleOnSingleUseCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardType: "single-use", cardId: cardId });
  };

  const handleOnPressGenerateNew = () => {
    navigation.navigate("CardActions.SingleUseCardInfo");
  };

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const handleOnActivateNowPress = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <>
      <Page>
        <NavHeader title={t("CardActions.HomeScreen.navTitle")} end={false} />
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p">
            {cardsList?.map(card =>
              card.CardType !== SINGLE_USE_CARD_TYPE ? (
                card.Status === "unfreeze" ? (
                  <BankCard.Active
                    key={card.CardId}
                    cardNumber={card.LastFourDigits}
                    cardType={card.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "plus"}
                    label={
                      card.ProductId === STANDARD_CARD_PRODUCT_ID
                        ? t("CardActions.standardCard")
                        : t("CardActions.plusCard")
                    }
                    endButton={
                      <ContextMenu
                        actions={contextMenuActions}
                        dropdownMenuMode={true}
                        onPress={e => {
                          e.nativeEvent.index === 0
                            ? isCardFrozen
                              ? handleOnUnfreezeCardPress("")
                              : handleOnFreezeCardPress("")
                            : e.nativeEvent.index === 1
                            ? handleOnViewPinPress()
                            : handleOnCardSettingsPress("active");
                        }}>
                        <BankCard.EndButton icon={<ThreeDotsIcon />} />
                      </ContextMenu>
                    }
                    onPress={handleOnActiveCardPress.bind(null, card.CardId)}
                  />
                ) : card.Status === "freeze" ? (
                  <BankCard.Inactive
                    key={card.CardId}
                    type="frozen"
                    label={
                      card.ProductId === STANDARD_CARD_PRODUCT_ID
                        ? t("CardActions.standardCard")
                        : t("CardActions.plusCard")
                    }
                    actionButton={<BankCard.ActionButton type="dark" title={t("CardActions.cardFrozen")} />}
                    endButton={
                      <ContextMenu
                        actions={contextMenuActions}
                        dropdownMenuMode={true}
                        onPress={e => {
                          e.nativeEvent.index === 0
                            ? isCardFrozen
                              ? handleOnUnfreezeCardPress(card.CardId)
                              : handleOnFreezeCardPress(card.CardId)
                            : e.nativeEvent.index === 1
                            ? handleOnViewPinPress()
                            : handleOnCardSettingsPress("inactive");
                        }}>
                        <BankCard.EndButton icon={<ThreeDotsIcon />} />
                      </ContextMenu>
                    }
                  />
                ) : (
                  <BankCard.Inactive
                    key={card.CardId}
                    type="inactive"
                    label={
                      card.ProductId === STANDARD_CARD_PRODUCT_ID
                        ? t("CardActions.standardCard")
                        : t("CardActions.plusCard")
                    }
                    actionButton={
                      <BankCard.ActionButton
                        type="light"
                        title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                        onPress={handleOnActivateNowPress}
                      />
                    }
                    onPress={handleOnInactiveCardPress.bind(null, card.CardId)}
                  />
                )
              ) : (
                <BankCard.Active
                  cardNumber={card.LastFourDigits}
                  cardType="single-use"
                  endButton={
                    <Pressable onPress={handleOnPressAbout}>
                      <BankCard.EndButton icon={<InfoCircleIcon />} />
                    </Pressable>
                  }
                  onPress={handleOnSingleUseCardPress.bind(null, card.CardId)}
                  label={t("CardActions.singleUseCard")}
                />
              )
            )}
            <BankCard.Inactive
              type="inactive"
              label={t("CardActions.standardCard")}
              actionButton={
                <BankCard.ActionButton
                  type="light"
                  title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                  onPress={handleOnActivateNowPress}
                />
              }
              onPress={handleOnInactiveCardPress.bind(null, "")} // TODO: hardcode this card for now without cardId (UI only) because inactive card is not ready until BC4
              endButton={
                <ContextMenu
                  actions={contextMenuActions}
                  dropdownMenuMode={true}
                  onPress={e => {
                    e.nativeEvent.index === 0
                      ? isCardFrozen
                        ? handleOnUnfreezeCardPress(card.CardId)
                        : handleOnFreezeCardPress(card.CardId)
                      : e.nativeEvent.index === 1
                      ? handleOnViewPinPress()
                      : handleOnCardSettingsPress("active");
                  }}>
                  <BankCard.EndButton icon={<ThreeDotsIcon />} />
                </ContextMenu>
              }
            />
            {customerTier.data?.tier === "Plus" && singleUseCard === undefined ? (
              <BankCard.Inactive
                type="inactive"
                endButton={
                  <Pressable onPress={handleOnPressAbout}>
                    <BankCard.EndButton icon={<InfoCircleIcon />} />
                  </Pressable>
                }
                actionButton={
                  <BankCard.ActionButton
                    title={t("CardActions.generateNew")}
                    type="light"
                    onPress={handleOnPressGenerateNew}
                  />
                }
                label={t("CardActions.singleUseCard")}
              />
            ) : null}
          </Stack>
        </ScrollView>
      </Page>
      <ViewPinModal
        pin="0382"
        visible={isViewingPin}
        onClose={() => {
          setIsViewingPin(false);
        }}
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={showErrorModal}
        onClose={handleOnErrorModalClose}
      />
    </>
  );
}
