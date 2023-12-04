import { StackActions } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import { NotificationModal } from "@/components/NotificationModal/index.stories";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { LowRiskIcon, OnboardingLogo } from "../assets";
import { GoldWalletCreatingBenefit } from "../components";
import { useCreateWallet } from "../hooks/query-hooks";

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { mutateAsync: createWallet, isLoading: isCreatingWallet } = useCreateWallet();

  const goldWalletCreatingBenefit = [
    { icon: LowRiskIcon, description: t("GoldWallet.OnBoardingScreen.features.lowRisk") },
  ];

  const [isTermsAndConditionsAgreed, setIsTermsAndConditionsAgreed] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const handleOnToggleTermsAndConditionsAgreeing = () => {
    setIsTermsAndConditionsAgreed(state => !state);
  };

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("GoldWalletStack.TermsAndConditions");
  };

  const handleOnConfirmPress = async () => {
    try {
      await createWallet();
      await setItemInEncryptedStorage("goldWalletTermsAcceptance", "1");
      navigation.dispatch(StackActions.replace("GoldWallet.HubScreen"));
    } catch (err) {
      setIsErrorModalVisible(true);
    }
  };

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    justifyContent: "space-between",
    height: "100%",
  }));

  const featureContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "20%",
    marginBottom: theme.spacing["16p"],
  }));

  const termsAndConditionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["64p"],
  }));

  const termsAndConditionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    textDecorationLine: "underline",
    marginLeft: theme.spacing["4p"],
  }));

  return (
    <Page backgroundColor="neutralBase+30">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={contentContainer}>
        <View style={styles.logoContainerStyle}>
          <OnboardingLogo />
        </View>
        <Typography.Header
          size="brand"
          weight="bold"
          align="center"
          style={styles.titleContainerStyle}
          color="neutralBase-60">
          {t("GoldWallet.OnBoardingScreen.title")}
        </Typography.Header>
        <ScrollView showsVerticalScrollIndicator={false} style={featureContainerStyle}>
          {goldWalletCreatingBenefit.map(benefit => (
            <GoldWalletCreatingBenefit key={benefit.description} description={benefit.description} />
          ))}
        </ScrollView>
        <Stack direction="horizontal" style={termsAndConditionsContainerStyle}>
          <CheckboxInput
            isEditable={true}
            label={t("GoldWallet.OnBoardingScreen.agree")}
            value={isTermsAndConditionsAgreed}
            onChange={handleOnToggleTermsAndConditionsAgreeing}
          />
          <Pressable onPress={handleOnTermsAndConditionsPress}>
            <Typography.Text size="footnote" color="primaryBase-40" style={termsAndConditionsTextStyle}>
              {t("GoldWallet.OnBoardingScreen.termsAndConditions")}
            </Typography.Text>
          </Pressable>
        </Stack>
        <Button
          disabled={!isTermsAndConditionsAgreed}
          onPress={handleOnConfirmPress}
          loading={isCreatingWallet}
          color="dark">
          {t("GoldWallet.OnBoardingScreen.confirm")}
        </Button>
      </View>
      <NotificationModal
        variant="error"
        title={t("GoldWallet.OnBoardingScreen.error.title")}
        buttons={{
          primary: <Button onPress={handleOnConfirmPress}>{t("GoldWallet.OnBoardingScreen.error.tryAgain")}</Button>,
        }}
        onClose={() => setIsErrorModalVisible(false)}
        isVisible={isErrorModalVisible}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  logoContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainerStyle: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: "75%",
  },
});
