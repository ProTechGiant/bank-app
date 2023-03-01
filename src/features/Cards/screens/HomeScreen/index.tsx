import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, ViewStyle } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { InfoCircleIcon, ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface ContextMenuItem {
  id: number;
  title: string;
  systemIcon?: string;
  disabled?: boolean;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

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
    setIsCardFrozen(!isCardFrozen); // TODO: BE integration. update icon for now
    Alert.alert("Freeze/Unfreeze card is coming");
  };

  const handleOnViewPinPress = () => {
    Alert.alert("View Pin is coming");
  };

  const handleOnCardSettingsPress = () => {
    navigation.navigate("CardActions.CardActionsStack", { screen: "CardActions.CardSettingsScreen" });
  };
  // To be use later
  // const handleOnGenerateCardPress = () => {
  //   navigation.navigate("CardActions.CardActionsStack", { screen: "CardActions.SingleUseCardInfo" });
  // };

  const handleCardOnPress = () => {
    navigation.navigate("CardActions.CardActionsStack", { screen: "CardActions.CardDetailsScreen" });
  };
  // To be  use later
  // const infoIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-50"]);

  const infoIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.cardInfo);

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const navigateToAboutPage = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  return (
    <Page>
      <NavHeader title={t("Cards.HomeScreen.navTitle")} withBackButton={false} end={false} />
      <ContentContainer>
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p">
            <BankCard.Active
              cardNumber="4433"
              cardType="plus"
              endButton={
                <ContextMenu
                  actions={contextMenuActions}
                  dropdownMenuMode={true}
                  onPress={e => {
                    e.nativeEvent.index === 0
                      ? handleOnFreezeUnfreezeCardPress()
                      : e.nativeEvent.index === 1
                      ? handleOnViewPinPress()
                      : handleOnCardSettingsPress();
                  }}>
                  <Pressable onPress={navigateToAboutPage}>
                    <BankCard.EndButton icon={<ThreeDotsIcon />} />
                  </Pressable>
                </ContextMenu>
              }
              label={t("Cards.plusCard")}
              onPress={handleCardOnPress}
            />
            <BankCard.Active
              cardNumber="3333"
              cardType="single-use"
              endButton={
                <Pressable onPress={navigateToAboutPage}>
                  <BankCard.EndButton
                    icon={<InfoCircleIcon width={infoIconDimensions} height={infoIconDimensions} />}
                  />
                </Pressable>
              }
              label={t("Cards.singleUseCard")}
            />
            {/* todo remove comment to test unmasked card details
            <BankCard.Unmasked
              cardNumber="5555 5555 5555 3333"
              cardType="single-use"
              cardDetails={{ endDate: "07/25", securityCode: 122 }}
              onCopyPress={onCopyPress}
            />
            <BankCard.Inactive
              endButton={
                <Pressable>
                  <BankCard.EndButton icon={<InfoCircleIcon />} />
                </Pressable>
              }
              label={t("Cards.singleUseCard")}
              actionButton={
                <BankCard.ActionButton title={t("Cards.generateNew")} onPress={handleOnGenerateCardPress} />
              }
            /> */}
          </Stack>
        </ScrollView>
      </ContentContainer>
    </Page>
  );
}
