import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import BankCard from "@/components/BankCard";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function SelectLuxCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={container}>
      <BankCard variant="lux" width="100%" />
      <View style={styles.bottom}>
        <Typography.Text size="caption1" color="neutralBase" style={styles.text}>
          {t("ApplyCards.ApplyForCardScreen.lux.remarks")}
        </Typography.Text>
        <Button block onPress={onPress}>
          {t("ApplyCards.ApplyForCardScreen.lux.button")}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignSelf: "stretch",
  },
  text: {
    marginVertical: 12,
    textAlign: "center",
  },
});
