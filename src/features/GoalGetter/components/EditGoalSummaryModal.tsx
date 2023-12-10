import { toString } from "lodash";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import FieldComponent from "./FieldComponent";

interface EditGoalSummaryModalProps {
  isVisible: boolean;
  setIsVisible: (status: boolean) => void;
  onConfirmPress: () => void;
  name: string;
  targetAmount: number;
  targetDate: string;
  contributionMethods: string;
  percentage?: number;
  contributionAmount: number;
  recurringMethod: string;
  contributionDate: string;
  image: string;
}
export default function EditGoalSummaryModal({
  isVisible,
  setIsVisible,
  onConfirmPress,
  name,
  targetAmount,
  targetDate,
  contributionMethods,
  percentage,
  contributionAmount,
  recurringMethod,
  contributionDate,
  image,
}: EditGoalSummaryModalProps) {
  const { t } = useTranslation();

  const fieldContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
    width: "100%",
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));
  return (
    <Modal
      headerText={t("GoalGetter.EditGoalGetter.SummaryModal.editGoal")}
      style={styles.modalStyle}
      visible={isVisible}
      onBack={() => setIsVisible(false)}>
      <ScrollView style={buttonsContainerStyle} showsVerticalScrollIndicator={false}>
        <Stack direction="vertical" gap="24p">
          <Typography.Header weight="bold" size="large">
            {t("GoalGetter.EditGoalGetter.SummaryModal.title")}
          </Typography.Header>
          <Stack direction="horizontal" gap="16p" style={fieldContainerStyle}>
            <NetworkImage
              source={{
                uri: image,
              }}
              style={styles.imageStyle}
            />
            <Stack direction="vertical">
              <Typography.Text color="neutralBase-10">
                {t("GoalGetter.EditGoalGetter.SummaryModal.goalName")}
              </Typography.Text>
              <Typography.Text weight="medium">{name}</Typography.Text>
            </Stack>
          </Stack>

          <Stack direction="vertical" style={styles.fullWidth}>
            <Typography.Text
              weight="medium"
              color="neutralBase+30"
              style={[fieldContainerStyle, styles.bottomBorderNoRadius]}>
              {t("GoalGetter.EditGoalGetter.SummaryModal.goalInformation")}
            </Typography.Text>

            <FieldComponent
              title={t("GoalGetter.EditGoalGetter.SummaryModal.targetAmount")}
              value={formatCurrency(targetAmount, "SAR")}
            />
            <FieldComponent title={t("GoalGetter.EditGoalGetter.SummaryModal.targetDate")} value={targetDate} />
          </Stack>

          <Stack direction="vertical" style={styles.fullWidth}>
            <Typography.Text
              weight="medium"
              color="neutralBase+30"
              style={[fieldContainerStyle, styles.bottomBorderNoRadius]}>
              {t("GoalGetter.EditGoalGetter.SummaryModal.contributionDetails")}
            </Typography.Text>
            <FieldComponent
              title={t("GoalGetter.EditGoalGetter.SummaryModal.contributionMethods")}
              value={contributionMethods}
            />
            {percentage !== undefined ? (
              <FieldComponent
                title={t("GoalGetter.EditGoalGetter.SummaryModal.percentage")}
                value={`${percentage} %`}
              />
            ) : null}

            <FieldComponent
              title={t("GoalGetter.EditGoalGetter.SummaryModal.contributionAmount")}
              value={toString(contributionAmount)}
            />
            <FieldComponent
              title={t("GoalGetter.EditGoalGetter.SummaryModal.recurringMethod")}
              value={recurringMethod}
            />
            <FieldComponent
              title={t("GoalGetter.EditGoalGetter.SummaryModal.contributionDate")}
              value={contributionDate}
            />
          </Stack>
        </Stack>
        <View style={buttonsContainerStyle}>
          <Button onPress={onConfirmPress}>
            <Typography.Text color="neutralBase-60">
              {t("GoalGetter.EditGoalGetter.SummaryModal.confirm")}
            </Typography.Text>
          </Button>
          <Button onPress={() => setIsVisible(false)} variant="tertiary">
            <Typography.Text>{t("GoalGetter.EditGoalGetter.SummaryModal.edit")}</Typography.Text>
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomBorderNoRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  fullWidth: {
    width: "100%",
  },
  imageStyle: {
    height: "100%",
    width: "20%",
  },
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height: "100%",
  },
});
