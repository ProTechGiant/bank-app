import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Pressable, StyleSheet, View } from "react-native";
import { checkNotifications } from "react-native-permissions";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import List from "@/components/List";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { alphaNumericSpaceRegExp } from "@/utils";

import { useSGNotificationPreferences } from "../hooks/query-hooks";
import { EditGoalInput, SavingsPotDetailsResponse } from "../types";

interface EditSavingsGoalFormProps {
  onSubmit: (values: EditGoalInput) => void;
  onClose: () => void;
  data: SavingsPotDetailsResponse;
}

export default function EditSavingsGoalForm({ onSubmit, onClose, data }: EditSavingsGoalFormProps) {
  const { t } = useTranslation();

  const { data: notificationPreferences } = useSGNotificationPreferences();

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

  const handleOnNotificationToggleSwitch = async () => {
    const notificationPermission = await checkNotifications();
    //TODO: ALERTS WILL BE REPLACED BY NOTIFICATION MODAL ONCE WE WILL HAVE UPDATED DESIGNS
    if (notificationPermission.status !== "granted") {
      Alert.alert(
        t("SavingsGoals.PermissionAlertModal.nativeTitle"),
        t("SavingsGoals.PermissionAlertModal.nativeSubtitle"),
        [
          {
            text: t("SavingsGoals.PermissionAlertModal.back"),
            style: "cancel",
            onPress: () => null,
          },
          {
            text: t("SavingsGoals.PermissionAlertModal.settings"),
            onPress: () => {
              Linking.openSettings().then;
            },
          },
        ]
      );
      return;
    }

    if (notificationToggleFlag) {
      setValue("NotificationFlag", false);
    } else if (notificationPreferences?.NotificationPreferencesFlag && !notificationToggleFlag) {
      setValue("NotificationFlag", true);
    } else {
      Alert.alert(t("SavingsGoals.PermissionAlertModal.appTitle"), t("SavingsGoals.PermissionAlertModal.appSubtitle"), [
        {
          text: t("SavingsGoals.PermissionAlertModal.back"),
          style: "cancel",
          onPress: () => null,
        },
        {
          text: t("SavingsGoals.PermissionAlertModal.settings"),
          onPress: () => {
            handleNotificationsAlertAction();
          },
        },
      ]);
    }
  };

  const handleNotificationsAlertAction = () => {
    setToggleValue();
  };

  const setToggleValue = () => {
    setValue("NotificationFlag", !notificationToggleFlag, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
          testID="SavingsGoals.EditGoalModal:GoalNameInput"
        />
        <CurrencyInput
          control={control}
          showCharacterCount={false}
          label={t("SavingsGoals.CreateGoalScreen.form.amount.label")}
          name="TargetAmount"
          placeholder={t("SavingsGoals.CreateGoalScreen.form.amount.placeholder")}
          testID="SavingsGoals.EditGoalModal:TargetAmountInput"
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
          testID="SavingsGoals.EditGoalModal:TargetAmountInput"
          helperText={currentDate => {
            return differenceInDays(currentDate, new Date()) < 31
              ? t("SavingsGoals.CreateGoalScreen.form.targetDate.helperText")
              : undefined;
          }}
        />
        <List isBordered>
          <List.Item.Primary
            label={t("SavingsGoals.EditGoalScreen.notifications.label")}
            helperText={t("SavingsGoals.EditGoalScreen.notifications.helperText")}
            end={<List.End.Toggle onPress={handleOnNotificationToggleSwitch} value={watch("NotificationFlag")} />}
            testID="SavingsGoals.EditGoalModal:NotificationsActiveInput"
          />
        </List>
      </Stack>
      <View>
        <SubmitButton
          control={control}
          onSubmit={handleSubmit(onSubmit)}
          testID="SavingsGoals.EditGoalModal:SaveButton">
          {t("SavingsGoals.EditGoalScreen.save")}
        </SubmitButton>
        <Pressable onPress={onClose} style={styles.closeGoal} testID="SavingsGoals.EditGoalModal:CloseButton">
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
