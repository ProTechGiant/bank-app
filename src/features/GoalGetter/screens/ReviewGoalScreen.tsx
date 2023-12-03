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
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";
import { convertToISOFormat, getDayNameForDateString } from "../utils";

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
    // UploadGoalImage: uploadGoalImage, TODO: remove after fix api issue
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

  const submitGoalAttribute = () => {
    if (ProductType === "GOLD") {
      return {
        GoalName: goalName,
        TargetAmount: targetAmount,
        TargetDate: convertToISOFormat(targetDate),
        RiskId: riskId,
        ProductId: productId,
        GoalImage: goalImage,
        // UploadGoalImage: uploadGoalImage,
        UploadGoalImage: "base64string", // TODO: this is temp until BE team fix image base64 issue
        InitialContribution: initialContribution || "",
        MonthlyContribution: monthlyContribution,
      };
    } else {
      return {
        GoalName: goalName,
        TargetAmount: targetAmount,
        TargetDate: convertToISOFormat(targetDate),
        RiskId: riskId,
        ProductId: productId,
        GoalImage: goalImage,
        // UploadGoalImage: uploadGoalImage,
        UploadGoalImage: "base64string", // TODO: this is temp until BE team fix image base64 issue
        InitialContribution: initialContribution || "",
        MonthlyContribution: monthlyContribution,
        //TODO check with backend the Active
        RoundUpContribution: {
          Active: "ACTIVE",
        },
        //TODO check with backend the Value
        PercentageContribution: {
          Value: 0,
        },
        ...(RecurringFrequency
          ? {
              RecurringContribution: {
                Amount: RecurringAmount || 0,
                // TODO: check with BE team after fix api issues
                Frequency: RecurringFrequency?.toUpperCase() || "",
                Date: RecurringDate || new Date(),
              },
            }
          : {}),
      };
    }
  };

  const handleOnConfirmPress = () => {
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.ReviewGoalScreen",
        },
        otpVerifyMethod: "goals/submit",
        otpOptionalParams: submitGoalAttribute(),
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

  const handleProductType = () => {
    if (ProductType === "SAVING_POT") {
      return ContributionMethod?.join(", ");
    } else if (ProductType === "GOLD") {
      return t("GoalGetter.GoalReviewScreen.goalDetails.initial");
    } else {
      return t("GoalGetter.GoalReviewScreen.goalDetails.recurring");
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
    <Page
      backgroundColor="neutralBase-60"
      insets={["left", "right", "bottom", "top"]}
      testID="GoalGetter.GoalReviewScreen:Page">
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <NavHeader
        testID="oalGetter.GoalReviewScreen:NavHeader"
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
      <ContentContainer isScrollView testID="GoalGetter.GoalReviewScreen:ContentContainer">
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
              testID="GoalGetter.GoalReviewScreen-goalDetails"
              title={t("GoalGetter.GoalReviewScreen.goalDetails.contributionMethod")}
              value={handleProductType()}
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
                  RecurringFrequency === t("GoalGetter.ShapeYourGoalContributions.Monthly")
                    ? getDayNameForDateString(RecurringDate || "")
                    : RecurringDate
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
              testID="GoalGetter.GoalReviewScreen:NotificationModal"
              variant="warning"
              title={t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.title")}
              message={t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.description")}
              isVisible={isVisibleLeaveModal}
              buttons={{
                primary: (
                  <Button
                    onPress={handleOnLeaveModalFaqNavigation}
                    testID="GoalGetter.GoalReviewScreen:NotificationModalExitButton">
                    {t("GoalGetter.GoalReviewScreen.goalReviewNotificationModal.exitButton")}
                  </Button>
                ),
                secondary: (
                  <Button
                    onPress={handleOnLeaveModalDismiss}
                    testID="GoalGetter.GoalReviewScreen:NotificationModalCancelButton">
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
