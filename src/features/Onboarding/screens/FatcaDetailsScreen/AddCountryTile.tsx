import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AddCountryTileProps {
  onPress: () => void;
}

const AddCountryTile = ({ onPress }: AddCountryTileProps) => {
  const { t } = useTranslation();

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <View style={detailsCardStyle}>
        <Typography.Text size="callout" weight="medium" color="primaryBase">
          <PlusIcon /> {t("Onboarding.FatcaDetailsScreen.addCountry")}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase">
          {t("Onboarding.FatcaDetailsScreen.addCountryExtra")}
        </Typography.Text>
      </View>
    </Pressable>
  );
};

export default AddCountryTile;
