import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { generateShadow, useThemeStyles } from "@/theme";

interface AddCountryTileProps {
  onPress: () => void;
}

export default function AddCountryTile({ onPress }: AddCountryTileProps) {
  const { t } = useTranslation();

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={onPress}>
      <View style={[detailsCardStyle, styles.shadow]}>
        <View style={{ flexDirection: "row" }}>
          <PlusIcon color={iconColor} />
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            {t("Onboarding.FatcaDetailsScreen.addCountry")}
          </Typography.Text>
        </View>

        <Typography.Text size="footnote" weight="regular" color="neutralBase">
          {t("Onboarding.FatcaDetailsScreen.addCountryExtra")}
        </Typography.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: generateShadow(3),
});
