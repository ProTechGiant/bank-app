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
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { hasItemInStorage, removeItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { DetailSection, DetailSectionsContainer, TermsAndConditions } from "../components";
import { arabicMonths, monthNames } from "../constants";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";
import { getDayName, getDayNameForDateString } from "../utils";

export default function ReviewGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.ReviewGoalScreen">>();
  const otpFlow = useOtpFlow();
  const addToast = useToasts();

  const { mutateAsync: sendGoalGetterOTP } = useGoalGetterOTP();
  const {
    GoalName: goalName,
    TargetAmount: targetAmount,
    TargetDate: targetDate,
    InitialContribution: initialContribution,
    MonthlyContribution: monthlyContribution,
    RiskId: riskId,
    ProductId: productId,
    GoalImage: goalImage,
    RecurringAmount,
    RecurringFrequency,
    RecurringDate,
    ProductType,
    ProductName,
    RecurringContribution,
    Duration,
    ContributionMethod,
    setGoalContextState,
  } = useGoalGetterContext();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isVisibleLeaveModal, setIsVisibleLeaveModal] = useState(false);

  const parts = targetDate.split(" ");
  if (parts.length !== 3) {
    throw new RangeError("Invalid date format");
  }

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  let monthIndex;
  if (monthNames.includes(monthName)) {
    monthIndex = monthNames.indexOf(monthName);
  } else if (arabicMonths[monthName] !== undefined) {
    monthIndex = arabicMonths[monthName];
  } else {
    throw new RangeError("Invalid month name");
  }

  if (day < 1 || day > 31 || monthIndex === -1 || year < 1000 || year > 9999) {
    throw new RangeError("Invalid date components");
  }

  const date = new Date();
  date.setFullYear(year, monthIndex, day);
  date.setHours(0, 0, 0, 0);

  const isoDate = date.toISOString();

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
    navigation.navigate("GoalGetter.CreateGoalScreen");
  };

  const handleOnPressTargetAmount = () => {
    navigation.navigate("GoalGetter.ShapeGoalScreen");
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
        otpOptionalParams: {
          GoalName: goalName,
          TargetAmount: targetAmount,
          TargetDate: isoDate,
          RiskId: riskId,
          ProductId: productId,
          GoalImage: goalImage,
          InitialContribution: initialContribution,
          MonthlyContribution: monthlyContribution,
          //TODO check with backend the Active
          RoundUpContribution: {
            Active: "ACTIVE",
          },
          //TODO check with backend the Value
          PercentageContribution: {
            Value: 0,
          },
          RecurringContribution: {
            Amount: RecurringAmount,
            Frequency: RecurringFrequency?.toUpperCase(),
            Date: RecurringDate,
          },
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
          } else {
            addToast({
              variant: "warning",
              message: `${t("GoalGetter.GoalReviewScreen.otpFailed")}`,
            });
          }
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
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.ProductName")} value={ProductName || ""} />
          </DetailSectionsContainer>

          <DetailSectionsContainer showEditIcon onPress={handleOnPressGoalName}>
            <DetailSection title={t("GoalGetter.GoalReviewScreen.goalDetails.goalName")} value={goalName || ""} />
          </DetailSectionsContainer>

          <DetailSectionsContainer showEditIcon onPress={handleOnPressTargetAmount}>
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.targetAmount")}
              value={`${Number(targetAmount).toLocaleString("en-US", { minimumFractionDigits: 2 }) || ""} ${
                ProductType !== "Gold" ? t("GoalGetter.GoalReviewScreen.SAR") : t("GoalGetter.GoalReviewScreen.Grams")
              }`}
            />
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.duration")}
              value={Duration ? t("GoalGetter.ShapeYourGoalScreen.months", { value: Duration }) : ""}
            />
          </DetailSectionsContainer>

          <DetailSectionsContainer>
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.contributionMethod")}
              value={
                ProductType !== "GOLD" ? ContributionMethod ?? "" : t("GoalGetter.GoalReviewScreen.goalDetails.initial")
              }
            />
            <DetailSection
              title={t("GoalGetter.GoalReviewScreen.goalDetails.initialContribution")}
              value={
                initialContribution
                  ? `${initialContribution} ${
                      ProductType !== "GOLD"
                        ? t("GoalGetter.GoalReviewScreen.SAR")
                        : t("GoalGetter.GoalReviewScreen.Grams")
                    }`
                  : ""
              }
            />
            {ProductType !== "GOLD" ? (
              <DetailSection
                title={t("GoalGetter.GoalReviewScreen.goalDetails.recurringFrequency")}
                value={RecurringFrequency ?? ""}
              />
            ) : null}
            {ProductType !== "GOLD" ? (
              <DetailSection
                title={t("GoalGetter.GoalReviewScreen.goalDetails.recurringContribution")}
                value={
                  RecurringContribution
                    ? `${RecurringContribution} ${
                        ProductType !== "Gold"
                          ? t("GoalGetter.GoalReviewScreen.SAR")
                          : t("GoalGetter.GoalReviewScreen.Grams")
                      }`
                    : ""
                }
              />
            ) : null}
            {ProductType !== "GOLD" ? (
              <DetailSection
                title={t("GoalGetter.GoalReviewScreen.goalDetails.recurringDate")}
                value={
                  RecurringFrequency === "Monthly"
                    ? getDayNameForDateString(RecurringDate || "")
                    : getDayName(RecurringDate || "")
                }
              />
            ) : null}
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
