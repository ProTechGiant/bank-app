import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Radio from "@/components/Radio";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { DateRangeIcon, PaymentsIcon } from "../assets/icons";
import { RecommendationTypeEnum } from "../types";

type RecommendationSectionProps = {
  isSelected: boolean;
  toggleSelection: () => void;
  type: RecommendationTypeEnum;
} & (
  | {
      type: RecommendationTypeEnum.DATE;
      original: Date;
      recommended: Date;
    }
  | {
      type: RecommendationTypeEnum.AMOUNT;
      original: number;
      recommended: number;
    }
);
export default function RecommendationSection({
  isSelected,
  toggleSelection,
  type,
  original,
  recommended,
}: RecommendationSectionProps) {
  const { t } = useTranslation();
  const data =
    type === RecommendationTypeEnum.DATE
      ? {
          title: t("GoalGetter.EditGoalGetter.RecommendationModal.dateTitle"),
          recommended: format(recommended, "dd MMMM yyyy"),
          original: format(original, "dd MMMM yyyy"),
          icon: <DateRangeIcon />,
        }
      : RecommendationTypeEnum.AMOUNT
      ? {
          title: t("GoalGetter.EditGoalGetter.RecommendationModal.amountTitle"),
          recommended: formatCurrency(recommended, "SAR"),
          original: formatCurrency(original, "SAR"),
          icon: <PaymentsIcon />,
        }
      : {};
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
  }));
  return (
    <Pressable onPress={toggleSelection} style={styles.fullWidth} testID="goalGetter.component.recommendationSection">
      <Stack direction="horizontal" style={containerStyle}>
        {data.icon}
        <Stack direction="vertical" style={styles.textContainer}>
          <Typography.Text weight="medium">{data.title}</Typography.Text>
          <Typography.Text color="interactionBase">{data.recommended}</Typography.Text>
          <Typography.Text color="neutralBase-10">
            {t("GoalGetter.EditGoalGetter.RecommendationModal.original")} {data.original}
          </Typography.Text>
        </Stack>
        <Radio isSelected={isSelected} />
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  textContainer: {
    justifyContent: "space-between",
  },
});
