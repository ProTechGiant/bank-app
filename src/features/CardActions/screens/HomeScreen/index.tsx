import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, ViewStyle } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { InfoCircleIcon, ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams, CardStatus } from "../../CardActionsStack";
import ViewPinModal from "../../components/ViewPinModal";

interface ContextMenuItem {
  id: number;
  title: string;
  systemIcon?: string;
  disabled?: boolean;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.HomeScreen">>();

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

  const handleOnFreezeUnfreezeCardPress = () => {
    if (isCardFrozen) {
      navigation.navigate("CardActions.OneTimePasswordModal", {
        redirect: "CardActions.HomeScreen",
        action: "unfreeze",
      });
    }
    // @TODO: BE integration. update icon and card image for now
    setIsCardFrozen(!isCardFrozen);
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

  const handleOnGenerateCardPress = () => {
    navigation.navigate("CardActions.CardActionsStack", { screen: "CardActions.SingleUseCardInfo" });
  };

  const handleOnActivateNowPress = () => {
    Alert.alert("Activate now");
  };

  const { height: threeDotsIconHeight, width: threeDotsIconWidth } = useThemeStyles(
    theme => theme.iconDimensions.threeDots
  );

  const infoIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.cardInfo);

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
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
                      ? handleOnFreezeUnfreezeCardPress()
                      : e.nativeEvent.index === 1
                      ? handleOnViewPinPress()
                      : handleOnCardSettingsPress("inactive");
                  }}>
                  <BankCard.EndButton
                    icon={<ThreeDotsIcon />}
                    width={threeDotsIconWidth}
                    height={threeDotsIconHeight}
                  />
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
                      ? handleOnFreezeUnfreezeCardPress()
                      : e.nativeEvent.index === 1
                      ? handleOnViewPinPress()
                      : handleOnCardSettingsPress("active");
                  }}>
                  <BankCard.EndButton
                    icon={<ThreeDotsIcon />}
                    width={threeDotsIconWidth}
                    height={threeDotsIconHeight}
                  />
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
                    ? handleOnFreezeUnfreezeCardPress()
                    : e.nativeEvent.index === 1
                    ? handleOnViewPinPress()
                    : handleOnCardSettingsPress("inactive");
                }}>
                <BankCard.EndButton icon={<ThreeDotsIcon />} width={threeDotsIconWidth} height={threeDotsIconHeight} />
              </ContextMenu>
            }
            onPress={handleOnInactiveCardPress}
          />
          <BankCard.Active
            cardNumber="0238"
            cardType="single-use"
            label={t("Cards.singleUseCard")}
            endButton={
              <Pressable onPress={handleOnPressAbout}>
                <BankCard.EndButton icon={<InfoCircleIcon width={infoIconDimensions} height={infoIconDimensions} />} />
              </Pressable>
            }
            onPress={handleOnSingleUseCardPress}
          />
        </Stack>
        <ViewPinModal
          pin="0382"
          visible={showPin}
          onClose={() => {
            setShowPin(false);
          }}
        />
      </ScrollView>
    </Page>
  );
}
