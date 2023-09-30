import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { LargeCurrencyInput } from "@/components";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AlertInformMessage from "../components/AlertInformMessage";
import { USER_BALANCE } from "../constants";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { productData as PRODUCT_DATA } from "../mocks/mockProduct";

interface FormInput {
  monthlyContribution: number;
  initialContribution: number;
  selectedDay: string;
}
const CURRENT_STEP = 4;
const TOTAL_STEPS = 5;

export default function ContributionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState } = useGoalGetterContext();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      initialContribution: (() => {
        // For Mutual Fund, the initial contribution becomes mandatory.
        if (PRODUCT_DATA.ProductType === "MUTUAL_FUND") {
          return Yup.number()
            .required(t("GoalGetter.ContributionsScreen.requiredInitialContribution"))
            .positive(t("GoalGetter.ContributionsScreen.requiredInitialContribution"))
            .min(
              PRODUCT_DATA.MinimumInitial,
              t("GoalGetter.ContributionsScreen.minimumInitialContribution", { minAmount: PRODUCT_DATA.MinimumInitial })
            )
            .test(
              "balanceCheck",
              t("GoalGetter.ContributionsScreen.insufficientBalance"),
              value => USER_BALANCE >= (value || 0)
            );
        }
        // For all other products, the initial contribution is optional but if a number greater than zero is entered,
        // it must meet the minimum initial contribution requirement and not exceed the user balance.
        else {
          return Yup.number()
            .test(
              "nonZeroCheck",
              t("GoalGetter.ContributionsScreen.minimumInitialContribution", {
                minAmount: PRODUCT_DATA.MinimumInitial,
              }),
              (value = 0) => value === 0 || value >= PRODUCT_DATA.MinimumInitial
            )
            .test(
              "balanceCheck",
              t("GoalGetter.ContributionsScreen.insufficientBalance"),
              (value = 0) => value === 0 || USER_BALANCE >= value
            );
        }
      })(),

      monthlyContribution: (() => {
        // For Gold, we have a minimum buy quantity of 5 grams.
        // Monthly Contribution should not be less than the minimum purchase amount.
        if (PRODUCT_DATA.ProductType === "GOLD") {
          return Yup.number()
            .min(PRODUCT_DATA.MinimumMonthly, t("GoalGetter.ContributionsScreen.goldMonthlyMinimum"))
            .test(
              "goldMonthlyCheck",
              t("GoalGetter.ContributionsScreen.goldMonthlyMinimum"),
              value => (value || 0) >= PRODUCT_DATA.MonthlyContribution
            );
        }
        // For Saving Pot Calculation: Monthly contribution = Target Amount/number of months
        else if (PRODUCT_DATA.ProductType === "SAVING_POT") {
          return Yup.number().test(
            "savingPotMonthlyCheck",
            t("GoalGetter.ContributionsScreen.savingPotRecommend", {
              amount: PRODUCT_DATA.MonthlyContribution,
            }),
            value => value === PRODUCT_DATA.MonthlyContribution
          );
        }
        // For Mutual Fund Calculation: Monthly contribution = Target amount/target number of months.
        // If the monthly contribution amount is less than the minimum subscription, show an error.
        else if (PRODUCT_DATA.ProductType === "MUTUAL_FUND") {
          return Yup.number().min(
            PRODUCT_DATA.MinimumMonthly,
            t("GoalGetter.ContributionsScreen.minSubscriptionAmount")
          );
        }
        // Default condition if none of the above is met.
        else {
          return Yup.number();
        }
      })(),

      selectedDay: Yup.string().required(t("GoalGetter.ContributionsScreen.selectedDayRequired")),
    });
  }, [PRODUCT_DATA, USER_BALANCE]);

  const { control, handleSubmit, getFieldState, formState } = useForm<FormInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      initialContribution: 0,
      monthlyContribution: PRODUCT_DATA.MonthlyContribution,
      selectedDay: "",
    },
  });

  const initialContribution = getFieldState("initialContribution", formState);
  const monthlyContribution = getFieldState("monthlyContribution", formState);

  const [isRoundUpEnabled, setIsRoundUpEnabled] = useState<boolean>(false);
  const [isRoundUpChangeModalVisible, setIsRoundUpChangeModalVisible] = useState<boolean>(false);
  const [hasHadErrorBefore, setHasHadErrorBefore] = useState(false);
  useEffect(() => {
    if (monthlyContribution.error) {
      setHasHadErrorBefore(true);
    }
  }, [monthlyContribution.error]);

  const handleOnSubmit = (data: FormInput) => {
    //Todo : API call to update the data
    setGoalContextState({
      initialContribution: Number(data.initialContribution),
      monthlyContribution: Number(data.monthlyContribution),
      recurringDay: data.selectedDay,
      roundUP: isRoundUpEnabled ? "Y" : "N",
    });
    navigation.navigate("GoalGetter.ReviewGoalScreen");
  };

  const handleOnTogglePress = () => {
    if (!isRoundUpEnabled) {
      setIsRoundUpChangeModalVisible(true);
    }
    setIsRoundUpEnabled(!isRoundUpEnabled);
  };

  const handleOnRoundUpConfirmation = () => {
    // TODO: API call to update the toggle value
    setIsRoundUpChangeModalVisible(false);
    setIsRoundUpEnabled(true);
  };

  const handleOnRoundUpCancellation = () => {
    setIsRoundUpChangeModalVisible(false);
    setIsRoundUpEnabled(false);
  };
  const renderRecommendationAlert = (ProductType: string) => {
    if (ProductType === "SAVING_POT") {
      return (
        <AlertInformMessage
          contentMessage={t("GoalGetter.ContributionsScreen.savingPotRecommend", {
            amount: PRODUCT_DATA.MonthlyContribution,
          })}
        />
      );
    } else if (ProductType === "GOLD") {
      return (
        <AlertInformMessage
          contentMessage={t("GoalGetter.ContributionsScreen.goldMonthlyLimit", {
            minAmount: PRODUCT_DATA.MinimumMonthly,
          })}
        />
      );
    } else if (ProductType === "MUTUAL_FUND") {
      if (!hasHadErrorBefore) {
        return;
      }
      return (
        <AlertInformMessage
          contentMessage={t("GoalGetter.ContributionsScreen.minMonthlyContribution", {
            amount: PRODUCT_DATA.MinimumMonthly,
          })}
        />
      );
    }
  };

  const primaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerScrollStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["24p"],
    gap: theme.spacing["32p"],
    flex: 1,
  }));
  const headerViewStyle = useThemeStyles<ViewStyle>(() => ({
    flexDirection: PRODUCT_DATA.ProductType !== "MUTUAL_FUND" ? "column-reverse" : "column",
  }));
  const monthlyContributionAlertViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));
  const initialContributionAlertViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const toggleViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={CURRENT_STEP} totalStep={TOTAL_STEPS} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.containerFlex}>
        <ScrollView style={headerScrollStyle}>
          <View style={headerViewStyle}>
            <View style={inputContainerStyle}>
              <LargeCurrencyInput
                autoFocus={PRODUCT_DATA.ProductType === "MUTUAL_FUND"}
                name="initialContribution"
                control={control}
                question={t("GoalGetter.ContributionsScreen.question_1")}
                size="title3"
                currency={
                  PRODUCT_DATA.UnitOfMeasurment === "SAR"
                    ? t("GoalGetter.ContributionsScreen.SAR")
                    : t("GoalGetter.ContributionsScreen.grams")
                }
              />
            </View>
            <View style={inputContainerStyle}>
              <LargeCurrencyInput
                autoFocus={PRODUCT_DATA.ProductType !== "MUTUAL_FUND"}
                name="monthlyContribution"
                control={control}
                question={t("GoalGetter.ContributionsScreen.question_2")}
                size="title3"
                currency={
                  PRODUCT_DATA.UnitOfMeasurment === "SAR"
                    ? t("GoalGetter.ContributionsScreen.SAR")
                    : t("GoalGetter.ContributionsScreen.grams")
                }
              />
              <DayPickerInput
                buttonText={t("GoalGetter.ContributionsScreen.select")}
                control={control}
                name="selectedDay"
                headerText={t("GoalGetter.ContributionsScreen.selectDay")}
                disabled={monthlyContribution.isTouched && !!monthlyContribution.error}
              />
              {!monthlyContribution.error ? renderRecommendationAlert(PRODUCT_DATA.ProductType) : null}
            </View>
          </View>
          <View>
            <View style={monthlyContributionAlertViewStyle}>
              <View style={initialContributionAlertViewStyle}>
                {initialContribution.isTouched && initialContribution.error?.message ? (
                  <Alert message={initialContribution.error.message} variant="error" />
                ) : null}
              </View>
              {monthlyContribution.isTouched && monthlyContribution.error?.message ? (
                <Alert message={monthlyContribution.error.message} variant="error" />
              ) : null}
            </View>
          </View>
        </ScrollView>

        {PRODUCT_DATA.ProductType === "SAVING_POT" && !monthlyContribution.error ? (
          <View style={toggleViewStyle}>
            <Typography.Text color="primaryBase">{t("GoalGetter.ContributionsScreen.roundUp")}</Typography.Text>
            <Toggle onPress={handleOnTogglePress} value={isRoundUpEnabled} />
          </View>
        ) : null}

        {/* There is another condition to make this modal to show i think it need some api here */}
        <NotificationModal
          variant="warning"
          title={t("GoalGetter.ContributionsScreen.notificationModalTitle")}
          message={t("GoalGetter.ContributionsScreen.notificationModalMessage")}
          isVisible={isRoundUpChangeModalVisible}
          buttons={{
            primary: (
              <Button onPress={handleOnRoundUpConfirmation}>{t("GoalGetter.ContributionsScreen.okButton")}</Button>
            ),
            secondary: (
              <Button onPress={handleOnRoundUpCancellation}>{t("GoalGetter.ContributionsScreen.cancelButton")}</Button>
            ),
          }}
        />

        <View style={primaryButtonStyle}>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("GoalGetter.ContributionsScreen.next")}
          </SubmitButton>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerFlex: { flex: 1 },
  progressIndicator: { width: "80%" },
});
