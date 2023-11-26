import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { InfoBox } from "@/features/AllInOneCard/components";
import { useThemeStyles } from "@/theme";

import { RecommendationType } from "../types";
import RecommendationSection from "./RecommendationSection";
interface RecommendationModalProps {
  isVisible: boolean;
  setIsVisible: (state: boolean) => void;
  recommendations: RecommendationType[];
  selected: boolean[];
  toggleRecommendation: (index: number) => void;
  onUpdatePress: () => void;
  onProceedPress: () => void;
}
export default function RecommendationModal({
  isVisible,
  setIsVisible,
  recommendations,
  selected,
  toggleRecommendation,
  onUpdatePress,
  onProceedPress,
}: RecommendationModalProps) {
  const { t } = useTranslation();
  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    gap: theme.spacing["8p"],
  }));

  return (
    <Modal
      testID="goalGetter.component.recommendationModal"
      onClose={() => setIsVisible(false)}
      onBack={() => setIsVisible(false)}
      visible={isVisible}
      style={styles.modal}>
      <View style={styles.container}>
        <Stack direction="vertical" gap="24p">
          <View style={styles.fullWidth}>
            <Typography.Text size="title1">{t("GoalGetter.EditGoalGetter.RecommendationModal.title")}</Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {t("GoalGetter.EditGoalGetter.RecommendationModal.subtitle")}
            </Typography.Text>
          </View>
          {recommendations.map((r, index) => (
            <RecommendationSection
              isSelected={selected[index]}
              original={r.original}
              type={r.type}
              recommended={r.recommended}
              toggleSelection={() => toggleRecommendation(index)}
            />
          ))}
          <InfoBox description={t("GoalGetter.EditGoalGetter.RecommendationModal.info")} color="primaryBase-70" />
        </Stack>
        <View style={buttonsContainerStyle}>
          <Button onPress={onUpdatePress}>
            <Typography.Text color="neutralBase-60">
              {t("GoalGetter.EditGoalGetter.RecommendationModal.update")}
            </Typography.Text>
          </Button>
          <Button variant="secondary" onPress={onProceedPress}>
            <Typography.Text>{t("GoalGetter.EditGoalGetter.RecommendationModal.proceed")}</Typography.Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "90%",
    justifyContent: "space-between",
  },
  fullWidth: {
    width: "100%",
  },
  modal: {
    height: "95%",
    justifyContent: "space-between",
  },
});
