import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import * as yup from "yup";

import { DeleteIcon } from "@/assets/icons";
import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useEditBudgetSummary } from "../hooks/query-hooks";
import { EditMonthlyBudgetInputs } from "../types";
import EditInput from "./EditInput";

interface MonthlyBudgetEditFormProps {
  budgetSummary: {
    Amount: number;
    StartDate: number[];
    RepeatCycleId: string;
    RepeatNumber: number;
    BudgetId: number;
  };
  onClose: () => void;
  handleOnDelete: () => void;
}

export default function MonthlyBudgetEditForm({ budgetSummary, onClose, handleOnDelete }: MonthlyBudgetEditFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [year, month, day] = budgetSummary.StartDate;

  const [isHideTextInput, setIsHideTextInput] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isSuccessEditMessage, setIsSuccessEditMessage] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const EditBudgetSummary = useEditBudgetSummary();

  const validationSchema = yup.object().shape({
    UpdatedAmount: yup.number().required("Amount is required"),
  });

  const { control, handleSubmit, setValue } = useForm<EditMonthlyBudgetInputs>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      UpdatedAmount: budgetSummary.Amount.toString(),
    },
  });

  const handleOnSubmit = async ({ UpdatedAmount }: EditMonthlyBudgetInputs) => {
    setIsUpdateModalVisible(false);
    try {
      await EditBudgetSummary.mutateAsync({ UpdatedAmount, BudgetId: budgetSummary.BudgetId });
      setIsSuccessEditMessage(true);
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const handleOnCloseEditNotificationModal = () => {
    setIsSuccessEditMessage(false);
    onClose();
  };

  const handleOnEditAmount = () => {
    setIsHideTextInput(true);
  };

  const deleteIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <>
      <View style={styles.createBudget}>
        <Stack direction="vertical" align="stretch" gap="16p">
          <Typography.Text size="title1" weight="medium" color="neutralBase+30">
            {t("TopSpending.TopSpendingScreen.EditMonthlyBudget")}
          </Typography.Text>
          <EditInput
            isHideTextInput={isHideTextInput}
            onPress={handleOnEditAmount}
            name="Amount"
            value={budgetSummary.Amount}
            isEditable={true}
            children={
              <TextInput
                control={control}
                onClear={() => setValue("UpdatedAmount", "")}
                name="UpdatedAmount"
                label="Amount"
                keyboardType="numeric"
              />
            }
          />
          <EditInput
            name="Start Date"
            value={format(new Date(year, month - 1, day), "d MMM yyyy")}
            isEditable={false}
          />
          <EditInput
            name="Repeat cycle"
            value={budgetSummary.RepeatCycleId === "1" ? "Monthly" : "Yearly"}
            isEditable={false}
          />
          <EditInput name="Repeat number" value={budgetSummary.RepeatNumber} isEditable={false} />
        </Stack>
        <Stack direction="vertical" align="stretch" gap="8p">
          {isHideTextInput ? (
            <Button onPress={() => setIsUpdateModalVisible(true)}>
              {t("TopSpending.TopSpendingScreen.modal.save")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              iconLeft={<DeleteIcon width={20} height={20} color={deleteIconColor} />}
              onPress={() => setIsDeleteModalVisible(true)}>
              {t("TopSpending.TopSpendingScreen.modal.deleteBudget")}
            </Button>
          )}

          <Button variant="tertiary" onPress={onClose}>
            {t("TopSpending.TopSpendingScreen.modal.updateCancel")}
          </Button>
        </Stack>
      </View>
      <NotificationModal
        onClose={() => setIsUpdateModalVisible(false)}
        title={t("TopSpending.TopSpendingScreen.modal.updateMessage")}
        message=""
        isVisible={isUpdateModalVisible}
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleSubmit(handleOnSubmit)}>
              {t("TopSpending.TopSpendingScreen.modal.updateSave")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsUpdateModalVisible(false)}>
              {t("TopSpending.TopSpendingScreen.modal.updateCancel")}
            </Button>
          ),
        }}
      />

      <NotificationModal
        title={t("TopSpending.TopSpendingScreen.modal.updateSuccess")}
        isVisible={isSuccessEditMessage}
        message={t("TopSpending.TopSpendingScreen.modal.updateSuccessMessage")}
        onClose={handleOnCloseEditNotificationModal}
        variant="success"
      />

      <NotificationModal
        onClose={() => setIsDeleteModalVisible(false)}
        title={t("TopSpending.TopSpendingScreen.modal.deleteTitle")}
        message={t("TopSpending.TopSpendingScreen.modal.deleteMessage")}
        isVisible={isDeleteModalVisible}
        variant="warning"
        buttons={{
          primary: (
            <Button
              onPress={() => {
                setIsDeleteModalVisible(false);
                handleOnDelete();
              }}>
              {t("TopSpending.TopSpendingScreen.modal.deleteBudget")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsDeleteModalVisible(false)}>
              {t("TopSpending.TopSpendingScreen.modal.updateCancel")}
            </Button>
          ),
        }}
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
