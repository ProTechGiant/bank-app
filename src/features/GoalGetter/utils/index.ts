import { palette } from "@/theme/values";

export const getProgressColor = (goalTimeAchievePercentage: number, currentAmountPercentageValue: number) => {
  if (currentAmountPercentageValue >= goalTimeAchievePercentage) {
    return {
      backgroundColor: palette.secondary_mintBase,
    };
  } else if (goalTimeAchievePercentage - currentAmountPercentageValue <= 20) {
    return {
      backgroundColor: palette.warningBase,
    };
  } else if (goalTimeAchievePercentage - currentAmountPercentageValue > 20) {
    return {
      backgroundColor: palette.complimentBase,
    };
  }
};
