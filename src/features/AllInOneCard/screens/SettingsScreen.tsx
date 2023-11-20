import React from "react";
import { useTranslation } from "react-i18next";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
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
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("AllInOneCard.SettingsScreen.title")} variant="white" backgroundColor={NavHeaderColor} />
      <ContentContainer>
        <SettingItem label={t("AllInOneCard.SettingsScreen.changeCardPIN")} icon={<PinIcon />} />
        <SettingItem label={t("AllInOneCard.SettingsScreen.orderPhysicalCard")} icon={<CardIcon />} />
        <SettingItem label={t("AllInOneCard.SettingsScreen.statements")} icon={<StatementsIcon />} />
        <SettingItem label={t("AllInOneCard.SettingsScreen.cardClose")} icon={<ReplacementCardIcon />} />
        <SettingItem label={t("AllInOneCard.SettingsScreen.addToWallet")} icon={<WalletIcon />} />
        <SettingItem label={t("AllInOneCard.SettingsScreen.permanentCardClosure")} icon={<CardClosureIcon />} />
        <SettingItem label={t("AllInOneCard.SettingsScreen.FAQs")} icon={<QuestionMarkIcon />} />
      </ContentContainer>
    </Page>
  );
}
