import { useTranslation } from "react-i18next";
import { ImageBackground, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ProgressBar from "./ProgressBar";
import TagsProduct from "./TagsProduct";
import TagsRisk from "./TagsRisk";

interface GoalCardProps {
  goalName: string;
  currentBalance: number;
  targetAmount: number;
  targetDate: string;
  goalImage: string;
  productName: string;
  productColor: string;
  productRisk: string;
  productRiskColor: string;
  goalPercentageStatus: number;
  goalPercentageAmount: number;
}

export default function GoalCard({
  goalName,
  currentBalance,
  targetAmount,
  targetDate,
  goalImage,
  productName,
  productColor,
  productRisk,
  productRiskColor,
  goalPercentageStatus,
  goalPercentageAmount,
}: GoalCardProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnGoalCardPress = () => {
    navigation.navigate("GoalGetter.ManageGoal");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    overflow: "hidden",
  }));

  const ImageBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
    borderRadius: theme.radii.small,
    resizeMode: "cover",
  }));

  return (
    <Pressable onPress={handleOnGoalCardPress} style={styles.pressableStyle}>
      <View style={containerStyle}>
        <ImageBackground source={{ uri: goalImage }} style={ImageBackgroundStyle}>
          <Stack direction="horizontal" gap="8p" justify="flex-end">
            <TagsProduct productName={productName} productColor={productColor} />
            <TagsRisk productRisk={productRisk} productRiskColor={productRiskColor} />
          </Stack>

          <Typography.Text color="neutralBase-60" size="body" weight="bold">
            {goalName}
          </Typography.Text>

          <Typography.Text color="neutralBase-60" size="footnote" weight="bold">
            {currentBalance} {t("GoalGetter.GoalDashboardScreen.goalCard.of")} {targetAmount}{" "}
            {t("GoalGetter.GoalDashboardScreen.goalCard.currency")}
          </Typography.Text>

          <Typography.Text color="neutralBase-60" size="caption2" weight="regular">
            {t("GoalGetter.GoalDashboardScreen.goalCard.endDate")} {targetDate}
          </Typography.Text>

          <ProgressBar goalTimeAchievePercentage={goalPercentageStatus} goalPercentageAmount={goalPercentageAmount} />
        </ImageBackground>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableStyle: {
    marginBottom: 11,
  },
});
