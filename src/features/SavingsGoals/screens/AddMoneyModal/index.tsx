import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LightningBoltIcon, RecurringEventIcon, TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import CardButton from "./CardButton";

export default function AddMoneyModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [showBanner, setShowBanner] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setShowBanner(false);
    }, 3000);
  }, []);

  const handleOnClosePress = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };

  const handleOnRecommendedPaymentPress = () => {
    //TODO: handle navigation
  };
  const handleOnRecurringPaymentPress = () => {
    //TODO: handle navigation
  };
  const handleOnOneTimePaymentPress = () => {
    //TODO: handle navigation
  };

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));
  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));
  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));
  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
  }));
  const buttonsContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
  }));

  return (
    <>
      <View style={contentContainerStyle}>
        <DismissibleBanner
          visible={showBanner}
          message={t("SavingsGoals.AddMoneyModal.banner")}
          icon={<TickCircleIcon />}
        />
      </View>
      <SafeAreaProvider>
        <Page>
          <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
          <ContentContainer style={{ justifyContent: "space-between" }}>
            <View>
              <Typography.Text size="large" weight="bold" style={titleStyle}>
                {t("SavingsGoals.AddMoneyModal.title")}
              </Typography.Text>
              <Typography.Text size="callout" style={contentContainerStyle}>
                {t("SavingsGoals.AddMoneyModal.subText")}
              </Typography.Text>
              <View style={contentContainerStyle}>
                <Typography.Text size="callout" weight="medium" style={subTitleStyle}>
                  {t("SavingsGoals.AddMoneyModal.recommended.title")}
                </Typography.Text>
                <CardButton
                  onPress={handleOnRecommendedPaymentPress}
                  icon={<RecurringEventIcon />}
                  text={t("SavingsGoals.AddMoneyModal.recommended.amount")}
                />
              </View>
              <View>
                <Typography.Text size="callout" weight="medium" style={subTitleStyle}>
                  {t("SavingsGoals.AddMoneyModal.custom.title")}
                </Typography.Text>
                <View style={buttonsContainer}>
                  <CardButton
                    onPress={handleOnRecurringPaymentPress}
                    icon={<RecurringEventIcon />}
                    text={t("SavingsGoals.AddMoneyModal.custom.buttonOne")}
                  />
                  <View style={separatorStyle} />
                  <CardButton
                    onPress={handleOnOneTimePaymentPress}
                    icon={<LightningBoltIcon />}
                    text={t("SavingsGoals.AddMoneyModal.custom.buttonTwo")}
                  />
                </View>
              </View>
            </View>
            <View>
              <Button variant="tertiary" onPress={handleOnClosePress}>
                {t("SavingsGoals.AddMoneyModal.button")}
              </Button>
            </View>
          </ContentContainer>
        </Page>
      </SafeAreaProvider>
    </>
  );
}
