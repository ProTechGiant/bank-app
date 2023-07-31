import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface MonthlyBudgetProps {
  onPress: () => void;
}

export default function MonthlyBudget({ onPress }: MonthlyBudgetProps) {
  const { t } = useTranslation();

  const createBudgetStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  const iconCircleStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.xlarge,
  }));

  const plusIconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <Stack gap="12p" direction="horizontal" align="center" as={Pressable} onPress={onPress} style={createBudgetStyle}>
      <View style={iconCircleStyle}>
        <PlusIcon color={plusIconColor} />
      </View>
      <Stack flex={1} gap="4p" direction="vertical">
        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
          {t("TopSpending.TopSpendingScreen.CreateNewMonthlyBudget")}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="caption2" weight="regular">
          {t("TopSpending.TopSpendingScreen.subMessage")}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
