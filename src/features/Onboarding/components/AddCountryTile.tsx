import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AddCountryTileProps {
  onPress: () => void;
}

export default function AddCountryTile({ onPress }: AddCountryTileProps) {
  const { t } = useTranslation();

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <WithShadow backgroundColor="neutralBase-50" borderRadius="small" elevation={3}>
      <Pressable onPress={onPress}>
        <View style={detailsCardStyle}>
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
    </WithShadow>
  );
}
