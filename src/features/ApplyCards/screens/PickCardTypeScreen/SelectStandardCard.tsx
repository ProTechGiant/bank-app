import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import BankCard from "@/components/BankCard";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

export default function SelectStandardCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing.medium,
  }));

  return (
    <View style={container}>
      <BankCard variant="standard" width="100%" />
      <Button block onPress={onPress}>
        {t("ApplyCards.ApplyForCardScreen.standard.button")}
      </Button>
    </View>
  );
}
