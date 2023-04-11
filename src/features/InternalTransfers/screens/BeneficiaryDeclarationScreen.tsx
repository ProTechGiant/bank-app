import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BeneficiaryDeclarationSection } from "../components";

export default function BeneficiaryDeclarationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["24p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <>
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
      <ContentContainer isScrollView>
        <View style={titleContainerStyle}>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
            {t("InternalTransfers.BeneficiaryDeclarationScreen.title")}
          </Typography.Text>
        </View>
        <View>
          <Typography.Text size="callout" color="primaryBase" weight="medium">
            {t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionOneTitle")}
          </Typography.Text>
          <Typography.Text size="callout" color="primaryBase" weight="medium">
            {t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionTwoTitle")}
          </Typography.Text>
          <Typography.Text size="callout" color="primaryBase" weight="medium">
            {t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionThreeTitle")}
          </Typography.Text>
        </View>
        <View style={separatorStyle} />
        <BeneficiaryDeclarationSection
          title={t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionOneTitle")}
          content={t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionOneContent")}
        />
        <View style={separatorStyle} />
        <BeneficiaryDeclarationSection
          title={t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionTwoTitle")}
          content={t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionTwoContent")}
        />
        <View style={separatorStyle} />
        <BeneficiaryDeclarationSection
          title={t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionThreeTitle")}
          content={t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionThreeContent")}
        />
      </ContentContainer>
    </>
  );
}
