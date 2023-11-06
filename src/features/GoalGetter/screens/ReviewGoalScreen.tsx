import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

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

import { DetailSection, DetailSectionsContainer, TermsAndConditions } from "../components";
import { SAR } from "../constants";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";

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

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnClosePress = () => {
    setIsVisibleLeaveModal(true);
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("GoalGetter.TermsAndConditionsScreen", { productId: productId });
  };

  const handleOnLeaveModalFaqNavigation = () => {
    setIsVisibleLeaveModal(false);
    navigation.navigate("GoalGetter.GoalsAndProducts");
  };

  const handleOnPressGoalName = () => {
    navigation.navigate("GoalGetter.ShapeGoalScreen");
  };

  const handleOnPressTargetAmount = () => {
    navigation.navigate("GoalGetter.TargetAmountScreen");
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

  const goalGetterTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["24p"],
  }));

  const termsAndConditionSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <NavHeader
        title={t("GoalGetter.GoalReviewScreen.title")}
        onBackPress={handleOnBackPress}
        end={
          <NavHeader.IconEndButton
            icon={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnClosePress} />}
            onPress={handleOnClosePress}
          />
        }
      />
      <View style={progressBarStyle}>
        <ProgressIndicator currentStep={5} totalStep={5} />
      </View>
      <ContentContainer isScrollView>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium" style={goalGetterTitleStyle}>
          {t("GoalGetter.GoalReviewScreen.reviewGoal")}
        </Typography.Text>

        <Stack direction="vertical" gap="16p" align="stretch">
          <DetailSectionsContainer>
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.ProductName")} value="Fund 2" />
          </DetailSectionsContainer>

          <DetailSectionsContainer showEditIcon onPress={handleOnPressGoalName}>
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.goalName")} value="Rainy Day" />
          </DetailSectionsContainer>

          <DetailSectionsContainer showEditIcon onPress={handleOnPressTargetAmount}>
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.targetAmount")}
              value={`${"5,000.00"} ${
                productUnitOfMeasurement === SAR
                  ? t("GoalGetter.GoalReviewScreen.SAR")
                  : t("GoalGetter.GoalReviewScreen.Grams")
              }`}
            />
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.duration")} value="12 Months" />
          </DetailSectionsContainer>

          <DetailSectionsContainer>
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.contributionMethod")} value="Recurring" />
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.initialContribution")}
              value={`${"150.00"} ${
                productUnitOfMeasurement === SAR
                  ? t("GoalGetter.GoalReviewScreen.SAR")
                  : t("GoalGetter.GoalReviewScreen.Grams")
              }`}
            />
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.recurringFrequency")} value="Monthly" />
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.recurringContribution")}
              value={`${"500.00"} ${
                productUnitOfMeasurement === SAR
                  ? t("GoalGetter.GoalReviewScreen.SAR")
                  : t("GoalGetter.GoalReviewScreen.Grams")
              }`}
            />
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.recurringDate")} value="28th" />
          </DetailSectionsContainer>
          <View style={termsAndConditionSectionStyle}>
            <TermsAndConditions
              conditionsCaption={t("GoalGetter.GoalReviewScreen.termsAndConditionsText")}
              conditionsLink={t("GoalGetter.GoalReviewScreen.termsAndConditionsLink")}
              onCheckBoxPress={handleOnCheckboxPress}
              isChecked={!isDisabled}
              onPress={handleOnPressTermsAndConditions}
            />
          </View>
          <View style={termsAndConditionSectionStyle}>
            <Button disabled={isDisabled} onPress={handleOnConfirmPress}>
              {t("DateRangePicker.confirmButton")}
            </Button>
          </View>

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
        </Stack>
      </ContentContainer>
    </Page>
  );
}
