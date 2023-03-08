import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, SafeAreaView, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MoreInfoDropdown from "@/features/Onboarding/components/MoreInfoDropdown";
import LinkCard from "@/features/Onboarding/screens/NafathAuthScreen/LinkCard";
import LinkModal from "@/features/Onboarding/screens/NafathAuthScreen/LinkModal";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import useRequestOtpNumber from "./use-request-number";

export default function NafathAuthScreen() {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["16p"],
  }));

  const loadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    justifyContent: "center",
    marginVertical: theme.spacing["32p"],
  }));

  const numberContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    backgroundColor: theme.palette.complimentBase,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginVertical: theme.spacing["32p"],
    width: 60,
  }));

  const navigation = useNavigation();
  const requestOtpNumberAsync = useRequestOtpNumber();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requestedOtpNumber, setRequestedOtpNumber] = useState<number | undefined>();

  const handleOnToggleModal = async () => {
    const nextValue = !isModalVisible;
    setIsModalVisible(nextValue);

    if (nextValue) {
      const response = await requestOtpNumberAsync.mutateAsync();
      setRequestedOtpNumber(response.Otp);
    }
  };

  const handleOnOpenNafathApp = () => {
    navigation.navigate("Onboarding.ConfirmDetails");
  };

  const handleOnOpenNafathWebsite = () => {
    Linking.openURL("https://www.absher.sa/");
    setTimeout(() => navigation.navigate("Onboarding.ConfirmDetails"), 1000);
  };

  return (
    <SafeAreaView>
      <NavHeader withBackButton={false} title={t("Onboarding.NafathAuthScreen.navHeaderTitle")} />
      <View style={container}>
        <LinkModal
          modalVisible={isModalVisible}
          linkText={t("Onboarding.NafathAuthScreen.modalLink")}
          onNavigate={handleOnOpenNafathApp}
          toggleModal={handleOnToggleModal}>
          <Stack align="center" direction="vertical" justify="center">
            {requestedOtpNumber !== undefined ? (
              <View style={numberContainerStyle}>
                <Typography.Text color="neutralBase-50" weight="bold" size="title1" align="center">
                  {requestedOtpNumber}
                </Typography.Text>
              </View>
            ) : (
              <View style={loadingContainerStyle}>
                <Typography.Text color="neutralBase" weight="bold" size="title1" align="center">
                  {t("Onboarding.NafathAuthScreen.modalLoad")}
                </Typography.Text>
              </View>
            )}
            <Typography.Text color="neutralBase" size="footnote" weight="semiBold" align="center">
              {t("Onboarding.NafathAuthScreen.modalBody")}
            </Typography.Text>
          </Stack>
        </LinkModal>
        <View style={headerContainerStyle}>
          <Typography.Text size="large" weight="bold">
            {t("Onboarding.NafathAuthScreen.title")}
          </Typography.Text>
        </View>
        <Stack align="stretch" direction="vertical" gap="20p">
          <LinkCard onNavigate={handleOnToggleModal}>
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("Onboarding.NafathAuthScreen.appButtonTitle")}
              <Typography.Text weight="regular" size="footnote">
                {t("Onboarding.NafathAuthScreen.appButtonSubtitle")}
              </Typography.Text>
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {t("Onboarding.NafathAuthScreen.appButtonBody")}
            </Typography.Text>
          </LinkCard>
          <LinkCard onNavigate={handleOnOpenNafathWebsite}>
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("Onboarding.NafathAuthScreen.siteButtonTitle")}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {t("Onboarding.NafathAuthScreen.siteButtonBody")}
            </Typography.Text>
          </LinkCard>
          <MoreInfoDropdown title={t("Onboarding.NafathAuthScreen.dropdownTitle")}>
            <Typography.Text color="neutralBase" size="footnote">
              {t("Onboarding.NafathAuthScreen.dropdownBody")}
            </Typography.Text>
          </MoreInfoDropdown>
        </Stack>
      </View>
    </SafeAreaView>
  );
}
