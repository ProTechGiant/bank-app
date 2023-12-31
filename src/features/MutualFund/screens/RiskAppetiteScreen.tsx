import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { HighRiskIcon, LowRiskIcon, MediumRiskIcon } from "@/features/GoalGetter/assets/icons";
import { HeaderTitle } from "@/features/GoalGetter/components";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { RiskSection, TermsAndConditions } from "../components";
import { useGetRiskLevel } from "../hooks/query-hooks";

export default function RisksAppetiteScreen() {
  const navigation = useNavigation();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const { data: riskLevels } = useGetRiskLevel();

  const iconMappings = {
    icon1: <HighRiskIcon />,
    icon2: <MediumRiskIcon />,
    icon3: <LowRiskIcon />,
  };

  const { t } = useTranslation();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("MutualFund.TermsAndConditions");
  };

  const handleOnConfirmPress = () => {
    navigation.navigate("MutualFund.MutualFundOnboardingScreen");
    // TODO: add logic here when the API is working fine
  };

  const handleCardPress = (index: number) => {
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
    } else {
      setSelectedCardIndex(index);
    }
  };

  const colorMappings = {
    red: useThemeStyles<string>(theme => theme.palette["errorBase-30"]),
    yellow: useThemeStyles<string>(theme => theme.palette["warningBase-30"]),
    blue: useThemeStyles<string>(theme => theme.palette["interactionBase-30"]),
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["48p"],
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
  }));

  const termsAndConditionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],

    bottom: -theme.spacing["12p"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));
  const riskData = riskLevels?.RiskLevel || [];

  return (
    <Page backgroundColor="neutralBase-60" testID="MutualFund.RiskAppetite:Page">
      <NavHeader
        title={
          <View style={styles.screenTitleContainer}>
            <Typography.Text color="neutralBase+30" weight="medium" size="callout">
              {t("GoalGetter.RisksAppetiteScreen.title")}
            </Typography.Text>
          </View>
        }
        onBackPress={handleOnBackPress}
      />

      <Stack direction="vertical" style={contentStyle} align="stretch" gap="16p">
        <HeaderTitle
          headerText={t("MutualFund.Onboarding.onboardingTitle")}
          headerDescriptionText={t("MutualFund.Onboarding.onboardingSubTitle")}
        />

        {riskData.map((risk, index) => (
          <RiskSection
            key={risk.Id}
            title={risk.Title}
            subTitle={risk.Description}
            color={colorMappings[risk.Color]}
            icon={iconMappings[risk.Icon]}
            onSelect={() => handleCardPress(index)}
            isSelected={selectedCardIndex === index}
          />
        ))}

        <View style={termsAndConditionContainerStyle}>
          <TermsAndConditions
            conditionsCaption={t("MutualFund.TermsAndConditions.conditionsCaption")}
            conditionsLink={t("MutualFund.TermsAndConditions.conditionsLink")}
            onCheckBoxPress={handleOnCheckboxPress}
            isChecked={!isDisabled}
            onPress={handleOnPressTermsAndConditions}
          />
          <View style={buttonContainerStyle}>
            <Button
              onPress={handleOnConfirmPress}
              disabled={isDisabled}
              testID="MutualFund.FundSuccessfulOnboarding:Button">
              {t("MutualFund.Onboarding.confirmButton")}
            </Button>
          </View>
        </View>
      </Stack>
    </Page>
  );
}
const styles = StyleSheet.create({
  screenTitleContainer: { alignItems: "center", flexDirection: "row" },
});
