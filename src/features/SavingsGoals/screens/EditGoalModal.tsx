import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { differenceInDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard } from "@/components/TableList";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { alphaNumericSpaceRegExp } from "@/utils";

import { useRemoveSavingsGoal, useSavingsPot, useUpdateSavingsGoal } from "../hooks/query-hooks";
import { EditGoalInput } from "../types";

export default function EditGoalModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.EditGoalModal">>();

  const { data } = useSavingsPot(route.params.PotId);
  const updateData = useUpdateSavingsGoal();
  const removeGoal = useRemoveSavingsGoal();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        GoalName: Yup.string()
          .trim()
          .required(t("SavingsGoals.CreateGoalScreen.form.name.validation.required"))
          .matches(alphaNumericSpaceRegExp, t("SavingsGoals.CreateGoalScreen.form.name.validation.invalid")),
        TargetAmount: Yup.number()
          .required(t("SavingsGoals.CreateGoalScreen.form.amount.validation.required"))
          .min(0.01, t("SavingsGoals.CreateGoalScreen.form.amount.validation.required"))
          .max(9999999999, t("SavingsGoals.CreateGoalScreen.form.amount.validation.invalid"))
          .positive(t("SavingsGoals.CreateGoalScreen.form.amount.validation.positive")),
        TargetDate: Yup.date().required(t("SavingsGoals.CreateGoalScreen.form.targetDate.validation.required")),
      }),
    [t]
  );

  const handleOnClose = () => {
    setShowConfirmation(true);
  };

  const handleOnContinue = async () => {
    if (!data) return;
    setShowConfirmation(false);

    try {
      await removeGoal.mutateAsync({
        PotId: data.PotId,
      });
      navigation.navigate("SavingsGoals.SavingsGoalsScreen", {
        isGoalRemoved: true,
      });
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.navigate("SavingsGoals.SavingsGoalsScreen"),
        },
      ]);
    }
  };

  const handleOnCancel = () => {
    setShowConfirmation(false);
  };

  const handleOnCloseModal = () => {
    navigation.goBack();
  };

  const { control, handleSubmit, setValue, watch } = useForm<EditGoalInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      GoalName: data?.GoalName,
      TargetAmount: Number(data?.TargetAmount),
      TargetDate: new Date(data?.TargetDate),
      NotificationFlag: data?.NotificationFlag,
    },
  });

  const editSavingsGoal = async (values: EditGoalInput) => {
    if (!data) return;
    const { GoalName, TargetAmount, TargetDate, NotificationFlag } = values;

    try {
      await updateData.mutateAsync({
        PotId: data.PotId,
        GoalName,
        TargetAmount: TargetAmount.toString(),
        TargetDate: format(new Date(TargetDate), "yyyy-MM-dd"),
        NotificationFlag,
      });

      navigation.navigate("SavingsGoals.GoalDetailsScreen", {
        PotId: data?.PotId,
      });
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.navigate("SavingsGoals.SavingsGoalsScreen"),
        },
      ]);
    }
  };

  const handleOnSubmit = (values: EditGoalInput) => {
    editSavingsGoal(values);
  };

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          onBackPress={handleOnClose}
          withBackButton={false}
          title={t("SavingsGoals.EditModal.title")}
          end={<NavHeader.CloseEndButton onPress={handleOnCloseModal} />}
        />
        <ContentContainer style={styles.container}>
          <Stack direction="vertical" align="stretch" gap="20p">
            <TextInput
              control={control}
              showCharacterCount={false}
              label={t("SavingsGoals.CreateGoalScreen.form.name.label")}
              name="GoalName"
              placeholder={t("SavingsGoals.CreateGoalScreen.form.name.placeholder")}
              maxLength={50}
            />
            <CurrencyInput
              control={control}
              showCharacterCount={false}
              label={t("SavingsGoals.CreateGoalScreen.form.amount.label")}
              name="TargetAmount"
              placeholder={t("SavingsGoals.CreateGoalScreen.form.amount.placeholder")}
              maxLength={10}
            />
            <DatePickerInput
              control={control}
              placeholder={t("SavingsGoals.CreateGoalScreen.form.targetDate.openDatePickerButton")}
              headerText={t("SavingsGoals.CreateGoalScreen.form.targetDate.headerText")}
              label={t("SavingsGoals.CreateGoalScreen.form.targetDate.label")}
              name="TargetDate"
              buttonText={t("SavingsGoals.CreateGoalScreen.form.targetDate.datePickerButton")}
              minimumDate={new Date()}
              helperText={currentDate => {
                return differenceInDays(currentDate, new Date()) < 31
                  ? t("SavingsGoals.CreateGoalScreen.form.targetDate.helperText")
                  : undefined;
              }}
            />
            <TableListCard
              label={t("SavingsGoals.EditGoalScreen.notifications.label")}
              helperText={t("SavingsGoals.EditGoalScreen.notifications.helperText")}
              end={
                <TableListCard.Toggle
                  onPress={() => setValue("NotificationFlag", !watch("NotificationFlag"))}
                  value={watch("NotificationFlag")}
                />
              }
            />
          </Stack>
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
        <NotificationModal
          buttons={{
            primary: (
              <Button onPress={handleOnContinue}>{t("SavingsGoals.EditGoalScreen.modal.buttons.confirm")}</Button>
            ),
            secondary: (
              <Button onPress={handleOnCancel}> {t("SavingsGoals.EditGoalScreen.modal.buttons.cancel")}</Button>
            ),
          }}
          title={t("SavingsGoals.EditGoalScreen.modal.title")}
          message={t("SavingsGoals.EditGoalScreen.modal.content")}
          isVisible={showConfirmation}
          variant="confirmations"
        />
      </Page>
    </SafeAreaProvider>
  );
}

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
