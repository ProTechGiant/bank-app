import { useTranslation } from "react-i18next";
import { Image, View, ViewStyle } from "react-native";

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
      <Image
        style={{ aspectRatio: 1122 / 709, resizeMode: "contain", width: "100%", height: undefined }}
        source={require("@/assets/images/standard-card-placeholder.png")}
      />
      <Button block onPress={onPress}>
        {t("ApplyCards.ApplyForCardScreen.standard.button")}
      </Button>
    </View>
  );
}
