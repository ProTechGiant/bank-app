import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import DatePickerInput from "@/components/Form/DatePickerInput";
import DropdownInput from "@/components/Form/DropdownInput";
import TextInput from "@/components/Form/TextInput";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import { useCreateBudgetSummary } from "../hooks/query-hooks";
import { repeatCycleOptions } from "../mocks/MockData";
import { MonthlyBudgetInputs } from "../types";

interface MonthlyBudgetFormProps {
  onClose: () => void;
}

export default function MonthlyBudgetForm({ onClose }: MonthlyBudgetFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const createNewBudgetSummary = useCreateBudgetSummary();

  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [nextBudgetDate, setNextBudgetDate] = useState("");

  const validationSchema = yup.object().shape({
    RepeatNumber: yup
      .number()
      .typeError("RepeatNumber must be a number")
      .positive("RepeatNumber must be greater than 0")
      .required("RepeatNumber is required"),
    Amount: yup.number().required("Amount is required"),
  });

  const { control, handleSubmit } = useForm<MonthlyBudgetInputs>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async (data: MonthlyBudgetInputs) => {
    const formatDate = format(new Date(data.StartDate), "yyyy-MM-dd");
    try {
      const response = await createNewBudgetSummary.mutateAsync({ ...data, StartDate: formatDate });

      if (response?.NextBudgetDate) {
        const [year, month, day] = response.NextBudgetDate;
        setNextBudgetDate(format(new Date(year, month - 1, day), "d MMM yyyy"));
      } else {
        setNextBudgetDate("");
      }
      setIsSuccessMessage(true);
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const handleOnCloseNotificationModal = () => {
    setIsSuccessMessage(false);
  };

  return (
    <>
      <View style={styles.createBudget}>
        <Stack direction="vertical" align="stretch" gap="16p">
          <Typography.Text size="title2" color="neutralBase+30">
            {t("TopSpending.TopSpendingScreen.CreateMonthlyBudget")}
          </Typography.Text>
          <TextInput control={control} name="Amount" label="Amount" keyboardType="numeric" />
          <DatePickerInput
            buttonText={t("TopSpending.TopSpendingScreen.modal.select")}
            headerText={t("TopSpending.TopSpendingScreen.modal.headerText")}
            name="StartDate"
            control={control}
            label={t("TopSpending.TopSpendingScreen.modal.startDate")}
            placeholder="set"
            minimumDate={new Date()}
          />
          <DropdownInput
            isFixedHeight={false}
            control={control}
            placeholder={t("TopSpending.TopSpendingScreen.Yearly")}
            name="RepeatCycleId"
            label={t("TopSpending.TopSpendingScreen.SelectRepeatCycle")}
            options={repeatCycleOptions}
            buttonLabel={t("Settings.FinancialInformation.selectButton")}
            variant="small"
            autoselect
          />
          <TextInput control={control} name="RepeatNumber" label="Repeat Number" keyboardType="numeric" />
        </Stack>
        <Stack direction="vertical" align="stretch" gap="8p">
          <Button onPress={handleSubmit(handleOnSubmit)}>{t("TopSpending.TopSpendingScreen.modal.save")}</Button>
          <Button variant="tertiary" onPress={onClose}>
            {t("TopSpending.TopSpendingScreen.modal.updateCancel")}
          </Button>
        </Stack>
      </View>
      <NotificationModal
        title={t("TopSpending.TopSpendingScreen.createNewBudgetMessage.title")}
        isVisible={isSuccessMessage}
        message={
          nextBudgetDate
            ? t("TopSpending.TopSpendingScreen.createNewBudgetMessage.withDate", { nextBudgetDate: nextBudgetDate })
            : t("TopSpending.TopSpendingScreen.createNewBudgetMessage.withoutDate")
        }
        onClose={handleOnCloseNotificationModal}
        variant="success"
      />
    </>
  );
}

const styles = StyleSheet.create({
  createBudget: {
    flexGrow: 1,
    height: "92%",
    justifyContent: "space-between",
  },
});
