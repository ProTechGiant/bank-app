import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CardPlaceholder from "../../components/CardPlaceholder";
import LuxBottomBlueSvg from "./lux-bottom-blue.svg";
import LuxCardBackgroundSvg from "./lux-white-background.svg";

export default function SelectLuxCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={styles.container}>
      <LuxCardBackgroundSvg style={styles.luxBackground} />
      <LuxBottomBlueSvg style={styles.bottomBlue} />
      <SafeAreaView style={container}>
        <View style={styles.cardContainer}>
          <CardPlaceholder variant="lux" width="100%" />
        </View>
        <View style={styles.bottom}>
          <Typography.Text size="caption1" color="primaryBase-20" align="center" style={styles.text}>
            {t("ApplyCards.ApplyForCardScreen.lux.remarks")}
          </Typography.Text>
          <Button block onPress={onPress}>
            {t("ApplyCards.ApplyForCardScreen.lux.button")}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignSelf: "stretch",
  },
  bottomBlue: {
    bottom: 0,
    position: "absolute",
  },
  cardContainer: {
    marginTop: 30,
  },
  container: {
    flex: 1,
  },
  luxBackground: {
    position: "absolute",
    right: 0,
  },
  text: {
    marginVertical: 12,
  },
});
