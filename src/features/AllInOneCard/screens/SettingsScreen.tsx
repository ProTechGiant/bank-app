import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import {
  CardClosureIcon,
  CardIcon,
  PinIcon,
  QuestionMarkIcon,
  ReplacementCardIcon,
  StatementsIcon,
  WalletIcon,
} from "../assets/icons";
import { SettingItem } from "../components";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOrderPhysicalAddress = () => {
    navigation.navigate("AllInOneCard.DeliveryAddressScreen");
  };

  const handleChangePin = () => {
    navigation.navigate("AllInOneCard.changePin");
  };

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.SettingsScreen:Page">
      <StatusBar backgroundColor={NavHeaderColor} barStyle="light-content" />
      <NavHeader
        title={t("AllInOneCard.SettingsScreen.title")}
        variant="white"
        backgroundColor={NavHeaderColor}
        testID="AllInOneCard.SettingsScreen:NavHeader"
      />
      <ContentContainer>
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.changeCardPIN")}
          icon={<PinIcon />}
          onPress={handleChangePin}
          testID="AllInOneCard.SettingsScreen:changeCardPIN"
        />
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.orderPhysicalCard")}
          icon={<CardIcon />}
          onPress={handleOrderPhysicalAddress}
          testID="AllInOneCard.SettingsScreen:orderPhysicalCard"
        />
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.statements")}
          icon={<StatementsIcon />}
          testID="AllInOneCard.SettingsScreen:statements"
        />
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.cardClose")}
          icon={<ReplacementCardIcon />}
          testID="AllInOneCard.SettingsScreen:cardClose"
        />
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.addToWallet")}
          icon={<WalletIcon />}
          testID="AllInOneCard.SettingsScreen:addToWallet"
        />
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.permanentCardClosure")}
          icon={<CardClosureIcon />}
          testID="AllInOneCard.SettingsScreen:permanentCardClosure"
        />
        <SettingItem
          label={t("AllInOneCard.SettingsScreen.FAQs")}
          icon={<QuestionMarkIcon />}
          testID="AllInOneCard.SettingsScreen:FAQs"
        />
      </ContentContainer>
    </Page>
  );
}
