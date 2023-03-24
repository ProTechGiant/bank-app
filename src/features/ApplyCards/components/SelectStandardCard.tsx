import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import CardPlaceholder from "./CardPlaceholder";

export default function SelectStandardCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing["16p"],
  }));

  return (
    <SafeAreaView style={container}>
      <View style={styles.cardContainer}>
        <CardPlaceholder variant="standard" width="100%" />
      </View>
      <View style={styles.bottom}>
        <Button onPress={onPress}>{t("ApplyCards.ApplyForCardScreen.standard.button")}</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignSelf: "stretch",
  },
  cardContainer: {
    marginTop: 30,
  },
});
