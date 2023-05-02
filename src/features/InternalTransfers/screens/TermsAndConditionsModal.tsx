import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BeneficiaryDeclarationSection } from "../components";

export default function TermsAndConditionsModal() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnAgreePress = () => {
    navigation.goBack();
    navigation.navigate("InternalTransfers.QuickTransferScreen");
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const agreeAndDisagreeContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["32p"],
    paddingBottom: theme.spacing["48p"],
    paddingTop: theme.spacing["16p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
    flexGrow: 1,
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <ContentContainer isScrollView>
          <View style={containerStyle}>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.BeneficiaryDeclarationScreen.title")}
            </Typography.Text>
          </View>
          <View>
            <Typography.Text size="callout" color="primaryBase-40" weight="medium">
              {t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionOneTitle")}
            </Typography.Text>

            <Typography.Text size="callout" color="primaryBase-40" weight="medium">
              {t("InternalTransfers.BeneficiaryDeclarationScreen.sections.sectionTwoTitle")}
            </Typography.Text>

            <Typography.Text size="callout" color="primaryBase-40" weight="medium">
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
      </Page>
      <Stack direction="horizontal" style={agreeAndDisagreeContainerStyle} justify="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <Typography.Text color="primaryBase-40" size="body" weight="regular">
            {t("LocalTransfers.LocalTransfersTermsAndConditions.disagree")}
          </Typography.Text>
        </Pressable>

        <Pressable onPress={handleOnAgreePress}>
          <Typography.Text color="primaryBase-40" size="body" weight="semiBold">
            {t("LocalTransfers.LocalTransfersTermsAndConditions.agree")}
          </Typography.Text>
        </Pressable>
      </Stack>
    </SafeAreaProvider>
  );
}
