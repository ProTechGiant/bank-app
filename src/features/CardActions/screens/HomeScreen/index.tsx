import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, ViewStyle } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { InfoCircleIcon, ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams, CardStatus } from "../../CardActionsStack";
import ViewPinModal from "../../components/ViewPinModal";
import { mockCard } from "../../mocks/mockCard";
import { useFreezeCard, useUnfreezeCard } from "../../query-hooks";

interface ContextMenuItem {
  id: number;
  title: string;
  systemIcon?: string;
  disabled?: boolean;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const CARD_ID = "61aba98d-3eef-4993-98d5-3f60a7f74ed5"; // @TODO: get from BE

  const freezeCardAsync = useFreezeCard();
  const unfreezeCardAsync = useUnfreezeCard();

  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.HomeScreen">>();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPin, setShowPin] = useState(route.params?.action === "view-pin" && route.params?.action !== undefined);

  useEffect(() => {
    setShowPin(route.params?.action === "view-pin");
  }, [route.params]);

  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const isFreezeCardActive = true; // @TODO BE integration
  const isViewPinActive = true; // @TODO BE integration

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
      disabled: !isViewPinActive,
    },
    {
      id: 3,
      title: t("CardActions.QuickMenu.settings"),
      systemIcon: "gearshape",
    },
  ];

  const handleOnFreezeCardPress = async () => {
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId: CARD_ID });
      response.Status === "freeze" ? setIsCardFrozen(true) : setShowErrorModal(true);
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async () => {
    try {
      const response = await unfreezeCardAsync.mutateAsync({ cardId: CARD_ID });
      if (response.OtpCode.length > 0 && response.OtpId.length > 0) {
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
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
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

  const handleOnPlusCardPress = () => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardType: "plus", cardStatus: "active" });
  };

  const handleOnInactiveCardPress = () => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardType: "standard", cardStatus: "inactive" });
  };

  const handleOnSingleUseCardPress = () => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardType: "single-use" });
  };

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const handleOnActivateNowPress = () => {
    Alert.alert("Activate now");
  };

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <>
      <Page>
        <NavHeader title={t("Cards.HomeScreen.navTitle")} end={false} />
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p">
            {isCardFrozen ? (
              <BankCard.Inactive
                type="frozen"
                endButton={
                  <ContextMenu
                    actions={contextMenuActions}
                    dropdownMenuMode={true}
                    onPress={e => {
                      e.nativeEvent.index === 0
                        ? isCardFrozen
                          ? handleOnUnfreezeCardPress()
                          : handleOnFreezeCardPress()
                        : e.nativeEvent.index === 1
                        ? handleOnViewPinPress()
                        : handleOnCardSettingsPress("inactive");
                    }}>
                    <BankCard.EndButton icon={<ThreeDotsIcon />} />
                  </ContextMenu>
                }
                label={t("Cards.plusCard")}
                actionButton={<BankCard.ActionButton title={t("Cards.cardFrozen")} type="dark" />}
              />
            ) : (
              <BankCard.Active
                cardNumber="4433"
                cardType="plus"
                label={t("Cards.plusCard")}
                endButton={
                  <ContextMenu
                    actions={contextMenuActions}
                    dropdownMenuMode={true}
                    onPress={e => {
                      e.nativeEvent.index === 0
                        ? isCardFrozen
                          ? handleOnUnfreezeCardPress()
                          : handleOnFreezeCardPress()
                        : e.nativeEvent.index === 1
                        ? handleOnViewPinPress()
                        : handleOnCardSettingsPress("active");
                    }}>
                    <BankCard.EndButton icon={<ThreeDotsIcon />} />
                  </ContextMenu>
                }
                onPress={handleOnPlusCardPress}
              />
            )}
            <BankCard.Inactive
              type="inactive"
              label={t("Cards.standardCard")}
              actionButton={
                <BankCard.ActionButton
                  type="light"
                  title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                  onPress={handleOnActivateNowPress}
                />
              }
              endButton={
                <ContextMenu
                  actions={contextMenuActions}
                  dropdownMenuMode={true}
                  onPress={e => {
                    e.nativeEvent.index === 0
                      ? isCardFrozen
                        ? handleOnUnfreezeCardPress()
                        : handleOnFreezeCardPress()
                      : e.nativeEvent.index === 1
                      ? handleOnViewPinPress()
                      : handleOnCardSettingsPress("inactive");
                  }}>
                  <BankCard.EndButton icon={<ThreeDotsIcon />} />
                </ContextMenu>
              }
              onPress={handleOnInactiveCardPress}
            />
            <BankCard.Active
              cardNumber={mockCard.LastFourDigits}
              cardType="single-use"
              label={t("Cards.singleUseCard")}
              endButton={
                <Pressable onPress={handleOnPressAbout}>
                  <BankCard.EndButton icon={<InfoCircleIcon />} />
                </Pressable>
              }
              onPress={handleOnSingleUseCardPress}
            />
          </Stack>
        </ScrollView>
      </Page>
      <ViewPinModal
        pin="0382"
        visible={showPin}
        onClose={() => {
          setShowPin(false);
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
