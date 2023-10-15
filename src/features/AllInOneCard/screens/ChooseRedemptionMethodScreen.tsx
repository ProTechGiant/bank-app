import { StackActions } from "@react-navigation/native";
import { t } from "i18next";
import React, { useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { InfoBox, OptionsList } from "../components";
import { cardType, rewardsMethods } from "./../mocks";

export default function ChooseRedemptionMethodScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  const [selectedRewardsMethod, setSelectedRewardsMethod] = useState<number>(0);

  const handleOnSelectPredefinedRisk = (value: number) => {
    setSelectedRewardsMethod(value);
  };

  //TODO : navigate When page be ready
  const handleOnContinue = () => {
    if (cardType.toLowerCase() === "nera".toLowerCase()) {
      // navigation.navigate("OrderSummaryScreen");
    } else if (cardType.toLowerCase() === "neraPlus".toLowerCase()) {
      navigation.navigate("AllInOneCard.SelectPaymentOption");
    }
  };

  const totalStepProgressIndicator = cardType.toLowerCase() === "nera".toLowerCase() ? 3 : 2;
  const handleOnCancelRedemption = () => {
    navigation.dispatch(StackActions.pop(2));
    navigation.navigate("Home.DashboardScreen");
  };
  const innerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));
  const optionListContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={totalStepProgressIndicator} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => setIsModalVisible(true)} />}
      />
      <View style={styles.container}>
        <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
          <View>
            <View style={innerContainerStyle}>
              <Typography.Text size="title1" weight="bold" align="left">
                {t("AllInOneCard.ChooseRedemptionMethodScreen.title")}
              </Typography.Text>
              <Typography.Text size="callout" weight="regular" align="left">
                {t("AllInOneCard.ChooseRedemptionMethodScreen.description")}
              </Typography.Text>
              <View style={optionListContainerStyle}>
                <OptionsList
                  optionsList={rewardsMethods}
                  onSelectOptions={handleOnSelectPredefinedRisk}
                  predefinedValue={selectedRewardsMethod}
                />
              </View>
            </View>
            <InfoBox
              description={t("AllInOneCard.ChooseRedemptionMethodScreen.infoBoxDescription")}
              color="complimentBase-10"
            />
          </View>
          <Button color="light" onPress={handleOnContinue} disabled={selectedRewardsMethod === 0}>
            {t("AllInOneCard.ChooseRedemptionMethodScreen.Continue")}
          </Button>
        </Stack>
      </View>
      <NotificationModal
        variant="warning"
        title={t("AllInOneCard.ChooseRedemptionMethodScreen.warningModal.title")}
        message={t("AllInOneCard.ChooseRedemptionMethodScreen.warningModal.message")}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnCancelRedemption}>
              {t("AllInOneCard.ChooseRedemptionMethodScreen.warningModal.CancelButton")}
            </Button>
          ),
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 21,
    marginHorizontal: 20,
  },
  progressIndicator: { width: "80%" },
});
