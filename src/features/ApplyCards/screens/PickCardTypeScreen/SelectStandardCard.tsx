import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import CardPlaceholder from "../../components/CardPlaceholder";

export default function SelectStandardCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={container}>
      <CardPlaceholder variant="standard" width="100%" />
      <View style={styles.bottom}>
        <Button onPress={onPress}>{t("ApplyCards.ApplyForCardScreen.standard.button")}</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignSelf: "stretch",
  },
});
