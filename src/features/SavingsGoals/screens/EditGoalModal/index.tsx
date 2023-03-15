import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import ToggleCard from "@/features/SavingsGoals/components/ToggleCard";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { alphaNumericSpaceRegExp } from "@/utils";

import { EditGoalInput } from "../../types";

export default function EditGoalModal() {
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();

  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.WithdrawGoalModal">>();
  const handleOnClose = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      PotId: route.params.PotId,
      amountWithdrawn: undefined,
    });
  };

  const validationSchema = useMemo(
    () =>
      Yup.object({
        GoalName: Yup.string()
          .required(t("SavingsGoals.CreateGoalScreen.form.name.validation.required"))
          .matches(alphaNumericSpaceRegExp, t("SavingsGoals.CreateGoalScreen.form.name.validation.invalid")),
        GoalAmount: Yup.number()
          .required(t("SavingsGoals.CreateGoalScreen.form.amount.validation.required"))
          .min(0.01, t("SavingsGoals.CreateGoalScreen.form.amount.validation.required"))
          .max(9999999999.99, t("SavingsGoals.CreateGoalScreen.form.amount.validation.invalid")),
        TargetDate: Yup.date().required(t("SavingsGoals.CreateGoalScreen.form.targetDate.validation.required")),
      }),
    [i18n.language]
  );

  const { control, handleSubmit, watch } = useForm<EditGoalInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      NotificationFlag: false,
    },
  });

  const targetDate = watch("TargetDate");

  const styles = StyleSheet.create({
    closeGoal: {
      marginTop: 20,
    },
    container: {
      justifyContent: "space-between",
    },
    datePicker: {
      paddingVertical: 20,
    },
  });

  const handleOnSubmit = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      PotId: route.params.PotId,
      amountWithdrawn: undefined,
    });
  };
  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          onBackPress={handleOnClose}
          withBackButton={false}
          title={t("SavingsGoals.EditModal.title")}
          end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
        />
        <ContentContainer style={styles.container}>
          <View>
            <TextInput
              control={control}
              showCharacterCount={true}
              label={t("SavingsGoals.CreateGoalScreen.form.name.label")}
              name="GoalName"
              placeholder={t("SavingsGoals.CreateGoalScreen.form.name.placeholder")}
              maxLength={50}
            />
            <CurrencyInput
              control={control}
              showCharacterCount={true}
              label={t("SavingsGoals.CreateGoalScreen.form.amount.label")}
              name="GoalAmount"
              placeholder={t("SavingsGoals.CreateGoalScreen.form.amount.placeholder")}
              maxLength={12}
            />
            <View style={styles.datePicker}>
              <DatePickerInput
                control={control}
                placeholder={t("SavingsGoals.CreateGoalScreen.form.targetDate.openDatePickerButton")}
                headerText={t("SavingsGoals.CreateGoalScreen.form.targetDate.headerText")}
                label={t("SavingsGoals.CreateGoalScreen.form.targetDate.label")}
                name="TargetDate"
                buttonText={t("SavingsGoals.CreateGoalScreen.form.targetDate.datePickerButton")}
                minimumDate={new Date()}
                helperText={currentDate => {
                  return differenceInDays(Platform.OS === "ios" ? currentDate : targetDate, new Date()) < 31
                    ? t("SavingsGoals.CreateGoalScreen.form.targetDate.helperText")
                    : undefined;
                }}
              />
            </View>
            <ToggleCard
              name="NotificationFlag"
              label={t("SavingsGoals.EditGoalScreen.notifications.label")}
              helperText={t("SavingsGoals.EditGoalScreen.notifications.helperText")}
              control={control}
            />
          </View>
          <View>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("SavingsGoals.EditGoalScreen.save")}
            </SubmitButton>
            <Pressable onPress={handleOnClose} style={styles.closeGoal}>
              <Typography.Text align="center" color="errorBase">
                {t("SavingsGoals.EditGoalScreen.closeGoal")}
              </Typography.Text>
            </Pressable>
          </View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
