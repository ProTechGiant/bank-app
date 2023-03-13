import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { PlusIcon, WithdrawIcon } from "@/assets/icons";
import Button from "@/components/Button";
import useThemeStyles from "@/theme/use-theme-styles";

interface ActionButtonsProps {
  onFundingPress: () => void;
  onWithdrawPress: () => void;
}

const ActionButtons = ({ onFundingPress, onWithdrawPress }: ActionButtonsProps) => {
  const { t } = useTranslation();

  const buttonsWrapper = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    marginTop: theme.spacing["48p"],
    columnGap: theme.spacing["12p"],
    marginHorizontal: theme.spacing["20p"],
  }));

  return (
    <View style={buttonsWrapper}>
      <View style={{ flex: 1 }}>
        <Button color="dark" onPress={onWithdrawPress} variant="secondary" iconLeft={<WithdrawIcon />}>
          {t("SavingsGoals.GoalDetailsScreen.ActionButtons.withdrawButton")}
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <Button variant="primary" color="dark" onPress={onFundingPress} iconLeft={<PlusIcon width={19} height={20} />}>
          {t("SavingsGoals.GoalDetailsScreen.ActionButtons.addMoneyButton")}
        </Button>
      </View>
    </View>
  );
};

export default ActionButtons;
