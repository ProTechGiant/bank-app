import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { hasItemInStorage, removeItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { GoalDataRow, TermsAndConditions } from "../components";
import { SAR } from "../constants";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";
import { getDateOfRecurringDay } from "../utils";

export default function ReviewGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.ReviewGoalScreen">>();
  const otpFlow = useOtpFlow();
  const blockedUserFlow = useBlockedUserFlow();

  const { mutateAsync: sendGoalGetterOTP } = useGoalGetterOTP();
  const {
    goalName,
    targetAmount,
    startDate,
    initialContribution,
    monthlyContribution,
    recurringDay,
    targetDate,
    productUnitOfMeasurement,
    riskId,
    productId,
    predefinedGoalId,
    goalImage,
    roundUP,
    setGoalContextState,
  } = useGoalGetterContext();

  const [isDisabled, setIsDisabled] = useState(true);
  const [isVisibleLeaveModal, setIsVisibleLeaveModal] = useState(false);

  useEffect(() => {
    if (params?.pendingGoalAttributes) {
      setGoalContextState(params.pendingGoalAttributes);
    }
  }, [params, setGoalContextState]);

  const upcomingContribution = recurringDay ? getDateOfRecurringDay(recurringDay) : null;

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnClosePress = () => {
    setIsVisibleLeaveModal(true);
  };

  const handleOnLeaveModalFaqNavigation = () => {
    setIsVisibleLeaveModal(false);
    navigation.navigate("GoalGetter.GoalsAndProducts");
  };

  const handleOnLeaveModalDismiss = () => {
    setIsVisibleLeaveModal(false);
  };

  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleOnConfirmPress = () => {
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.ReviewGoalScreen",
        },
        otpVerifyMethod: "goals/submit",
        // TODO: the name of attributes in PascalCase Based on LLD may be changed when api finished from BE team
        otpOptionalParams: {
          GoalName: goalName,
          TargetAmount: targetAmount,
          InitialContribution: initialContribution,
          MonthlyContribution: monthlyContribution,
          RecurringDay: recurringDay,
          TargetDate: targetDate,
          RiskId: riskId,
          ProductId: productId,
          RoundUP: roundUP,
          GoalImage: goalImage,
          PredefinedGoalId: predefinedGoalId,
          StartDate: startDate,
        },
        onOtpRequest: () => {
          return sendGoalGetterOTP();
        },
        onFinish: async status => {
          if (status === "success") {
            if (await hasItemInStorage("pendingGoalGetter")) {
              await removeItemFromEncryptedStorage("pendingGoalGetter");
            }
            navigation.navigate("GoalGetter.GoalCreatedSuccessfullyScreen");
          }
        },
        onUserBlocked: async () => {
          await setItemInEncryptedStorage(
            "pendingGoalGetter",
            JSON.stringify({
              goalName,
              targetAmount,
              startDate,
              initialContribution,
              monthlyContribution,
              recurringDay,
              targetDate,
              productUnitOfMeasurement,
              riskId,
              productId,
              predefinedGoalId,
              goalImage,
              roundUP,
            })
          );
          blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
        },
      });
    } catch (error) {
      warn("goal-getter", "error submitting goal attributes", JSON.stringify(error));
    }
  };

  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["48p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={
          <View style={progressBarStyle}>
            <ProgressIndicator currentStep={5} totalStep={5} />
          </View>
        }
        onBackPress={handleOnBackPress}
        end={
          <NavHeader.IconEndButton
            icon={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnClosePress} />}
            onPress={handleOnClosePress}
          />
        }
      />
      <ContentContainer isScrollView>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium">
          {t("GoalGetter.GoalReviewScreen.reviewGoal")}
        </Typography.Text>

        <Stack direction="vertical" style={styles.stackStyle} gap="4p">
          <GoalDataRow label={t("GoalGetter.GoalReviewScreen.goalDetails.goalName")} value={goalName} />
          <GoalDataRow
            label={t("GoalGetter.GoalReviewScreen.goalDetails.targetAmount")}
            value={`${targetAmount} ${
              productUnitOfMeasurement === SAR
                ? t("GoalGetter.GoalReviewScreen.SAR")
                : t("GoalGetter.GoalReviewScreen.Grams")
            }`}
          />
          <GoalDataRow label={t("GoalGetter.GoalReviewScreen.goalDetails.startDate")} value={startDate} />
        </Stack>

        <Stack direction="vertical" style={styles.stackStyle} gap="4p">
          <GoalDataRow
            label={t("GoalGetter.GoalReviewScreen.goalDetails.initialContribution")}
            value={`${initialContribution} ${
              productUnitOfMeasurement === SAR
                ? t("GoalGetter.GoalReviewScreen.SAR")
                : t("GoalGetter.GoalReviewScreen.Grams")
            }`}
          />
          <GoalDataRow
            label={t("GoalGetter.GoalReviewScreen.goalDetails.monthlyContribution")}
            value={`${monthlyContribution} ${
              productUnitOfMeasurement === SAR
                ? t("GoalGetter.GoalReviewScreen.SAR")
                : t("GoalGetter.GoalReviewScreen.Grams")
            }`}
          />
          <GoalDataRow
            label={t("GoalGetter.GoalReviewScreen.goalDetails.upcomingContributionDate")}
            value={upcomingContribution}
          />
          <GoalDataRow label={t("GoalGetter.GoalReviewScreen.goalDetails.endDate")} value={targetDate} />
        </Stack>

        <Stack gap="16p" direction="vertical" align="stretch">
          <TermsAndConditions
            conditionsCaption={t("GoalGetter.GoalReviewScreen.termsAndConditionsText")}
            conditionsLink={t("GoalGetter.GoalReviewScreen.termsAndConditionsLink")}
            onCheckBoxPress={handleOnCheckboxPress}
            isChecked={!isDisabled}
          />
          <Button disabled={isDisabled} onPress={handleOnConfirmPress}>
            {t("DateRangePicker.confirmButton")}
          </Button>
        </Stack>
      </ContentContainer>
      {isVisibleLeaveModal ? (
        <NotificationModal
          variant="warning"
          title={t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.title")}
          message={t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.description")}
          isVisible={isVisibleLeaveModal}
          buttons={{
            primary: (
              <Button onPress={handleOnLeaveModalFaqNavigation}>
                {t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.exitButton")}
              </Button>
            ),
            secondary: (
              <Button onPress={handleOnLeaveModalDismiss}>
                {t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.cancelButton")}
              </Button>
            ),
          }}
        />
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  stackStyle: {
    marginTop: 24,
    width: "100%",
  },
});
