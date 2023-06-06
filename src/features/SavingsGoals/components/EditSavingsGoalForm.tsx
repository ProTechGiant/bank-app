import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInDays } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import Stack from "@/components/Stack";
import { TableListCard } from "@/components/TableList";
import Typography from "@/components/Typography";
import { alphaNumericSpaceRegExp } from "@/utils";

import { EditGoalInput, SavingsPotDetailsResponse } from "../types";

interface EditSavingsGoalFormProps {
  onSubmit: (values: EditGoalInput) => void;
  onClose: () => void;
  data: SavingsPotDetailsResponse;
}
export default function EditSavingsGoalForm({ onSubmit, onClose, data }: EditSavingsGoalFormProps) {
  const { t } = useTranslation();

  //Todo: these are static value to handle case of PC-5429, values will be replace from context.
  const [isGlobalNotificationsOn, setIsGlobalNotificationsOn] = useState(true);
  const [isGlobalSavingsNotificationsOn, setIsGlobalSavingsNotificationsOn] = useState(false);

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

  const { control, handleSubmit, setValue, watch } = useForm<EditGoalInput>({
    mode: "onBlur",

    resolver: yupResolver(validationSchema),
    defaultValues: {
      GoalName: data.GoalName,
      TargetAmount: Number(data.TargetAmount),
      TargetDate: new Date(data.TargetDate),
      NotificationFlag: data.NotificationFlag,
    },
  });

  const notificationToggleFlag = watch("NotificationFlag");

  const handleOnNotificationToggleSwitch = () => {
    // handling AC2 case of PC-5429
    if (isGlobalNotificationsOn && !isGlobalSavingsNotificationsOn && !notificationToggleFlag) {
      handleNotificationAlert(
        t("SavingsGoals.EditGoalScreen.turnOnNotificationsAlert.globalSavingsGoalNotificationsTitle"),
        t("SavingsGoals.EditGoalScreen.turnOnNotificationsAlert.globalSavingsGoalNotificationsMessage")
      );
    }
    // handling AC3 case of PC-5429
    else if (!isGlobalNotificationsOn && !isGlobalSavingsNotificationsOn && !notificationToggleFlag) {
      handleNotificationAlert(
        t("SavingsGoals.EditGoalScreen.turnOnNotificationsAlert.globalNotificationsTitle"),
        t("SavingsGoals.EditGoalScreen.turnOnNotificationsAlert.globalNotificationsMessage")
      );
    } else {
      setToggleValue();
    }
  };

  const handleNotificationsAlertAction = () => {
    //Todo: these are static value to handle cases of PC-5429, need to update it with the API.
    setIsGlobalSavingsNotificationsOn(true);
    setIsGlobalNotificationsOn(true);

    setToggleValue();
  };

  const setToggleValue = () => {
    setValue("NotificationFlag", !notificationToggleFlag, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleNotificationAlert = (title: string, message: string) => {
    const cancelText = t("SavingsGoals.EditGoalScreen.turnOnNotificationsAlert.alertButtonCancel");
    const turnOnText = t("SavingsGoals.EditGoalScreen.turnOnNotificationsAlert.alertButtonTurnOn");

    Alert.alert(title, message, [
      {
        text: cancelText,
      },
      {
        text: turnOnText,
        onPress: handleNotificationsAlertAction,
      },
    ]);
  };

  return (
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
          end={<TableListCard.Toggle onPress={handleOnNotificationToggleSwitch} value={watch("NotificationFlag")} />}
        />
      </Stack>
      <View>
        <SubmitButton control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("SavingsGoals.EditGoalScreen.save")}
        </SubmitButton>
        <Pressable onPress={onClose} style={styles.closeGoal}>
          <Typography.Text align="center" color="errorBase">
            {t("SavingsGoals.EditGoalScreen.closeGoal")}
          </Typography.Text>
        </Pressable>
      </View>
    </ContentContainer>
  );
}
const styles = StyleSheet.create({
  closeGoal: {
    marginTop: 20,
  },
  container: {
    justifyContent: "space-between",
  },
});
