import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AddCountryTileProps {
  onPress: () => void;
}

export default function AddCountryTile({ onPress }: AddCountryTileProps) {
  const { t } = useTranslation();

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    padding: theme.spacing["12p"],
    borderRadius: 50,
  }));
  return (
    <Pressable onPress={onPress} testID="Onboarding.FatcaDetailsScreen:ForeignTaxCountryAddButton">
      <View style={detailsCardStyle}>
        <Stack direction="horizontal" gap="12p" justify="flex-start">
          <View style={iconContainerStyle}>
            <PlusIcon color={iconColor} />
          </View>
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("Onboarding.FatcaDetailsScreen.addCountry")}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {t("Onboarding.FatcaDetailsScreen.addCountryExtra")}
            </Typography.Text>
          </Stack>
        </Stack>
      </View>
    </Pressable>
  );
}
