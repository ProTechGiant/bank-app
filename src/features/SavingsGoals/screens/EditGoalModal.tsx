import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import EditSavingsGoalForm from "../components/EditSavingsGoalForm";
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
        {data !== undefined ? (
          <EditSavingsGoalForm data={data} onSubmit={handleOnSubmit} onClose={handleOnClose} />
        ) : null}
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
