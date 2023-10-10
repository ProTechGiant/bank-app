import { StackActions } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { LowRiskIcon, OnboardingLogo } from "../assets";
import { GoldWalletCreatingBenefit } from "../components";

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const goldWalletCreatingBenefit = [
    { icon: LowRiskIcon, description: t("GoldWallet.OnBoardingScreen.features.lowRisk") },
  ];

  const [isTermsAndConditionsAgreed, setIsTermsAndConditionsAgreed] = useState<boolean>(false);

  const handleOnToggleTermsAndConditionsAgreeing = () => {
    setIsTermsAndConditionsAgreed(state => !state);
  };

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("GoldWalletStack.TermsAndConditions");
  };

  const handleOnConfirmPress = () => {
    //TODO call the create wallet API then on success navigate to the gold wallet hubScreen
    navigation.dispatch(StackActions.replace("GoldWallet.HubScreen"));
  };

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    justifyContent: "space-between",
    height: "100%",
  }));

  const logoContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["32p"],
    justifyContent: "center",
    alignItems: "center",
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["32p"],
    width: "70%",
    justifyContent: "center",
    alignSelf: "center",
  }));

  const featureContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "20%",
    marginBottom: theme.spacing["16p"],
  }));

  const termsAndConditionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const termsAndConditionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    textDecorationLine: "underline",
    marginLeft: theme.spacing["4p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <View style={contentContainer}>
        <View style={logoContainerStyle}>
          <OnboardingLogo />
        </View>
        <Typography.Header size="large" weight="bold" align="center" style={titleContainerStyle}>
          {t("GoldWallet.OnBoardingScreen.title")}
        </Typography.Header>
        <ScrollView showsVerticalScrollIndicator={false} style={featureContainerStyle}>
          {goldWalletCreatingBenefit.map(benefit => (
            <GoldWalletCreatingBenefit
              key={benefit.description}
              icon={<benefit.icon />}
              description={benefit.description}
            />
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
            <Typography.Text size="footnote" color="successBase" style={termsAndConditionsTextStyle}>
              {t("GoldWallet.OnBoardingScreen.termsAndConditions")}
            </Typography.Text>
          </Pressable>
        </Stack>
        <Button disabled={!isTermsAndConditionsAgreed} onPress={handleOnConfirmPress}>
          {t("GoldWallet.OnBoardingScreen.confirm")}
        </Button>
      </View>
    </Page>
  );
}
