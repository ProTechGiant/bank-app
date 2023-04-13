import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import EnterBeneficiaryByAccountNumberForm from "../components/EnterBeneficiaryByAccountNumberForm";
import EnterBeneficiaryByIBANForm from "../components/EnterBeneficiaryByIBANForm";
import EnterBeneficiaryByMobileForm from "../components/EnterBeneficiaryByMobileForm";

export default function EnterBeneficiaryDetailsScreen() {
  const { t } = useTranslation();

  const options = [
    {
      title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.mobile"),
      form: <EnterBeneficiaryByMobileForm selectionType="mobileNo" />,
    },
    {
      title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.accountNumber"),
      form: <EnterBeneficiaryByAccountNumberForm selectionType="accountId" />,
    },
    {
      title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.iban"),
      form: <EnterBeneficiaryByIBANForm selectionType="IBAN" />,
    },
  ];

  const [activePillIndex, setActivePillIndex] = useState(0);

  const formContainer = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    marginTop: theme.spacing["24p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton />
        <ContentContainer isScrollView style={styles.flex}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.title")}
            </Typography.Text>
            <Stack direction="horizontal" gap="8p">
              {options.map((element, index) => (
                <Pill
                  key={index}
                  isActive={index === activePillIndex}
                  text={element.title}
                  onPress={() => {
                    setActivePillIndex(index);
                  }}
                />
              ))}
            </Stack>
          </Stack>
          <View style={formContainer}>{options[activePillIndex].form}</View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
