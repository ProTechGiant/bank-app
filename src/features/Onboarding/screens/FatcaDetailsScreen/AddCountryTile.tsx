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
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.palette["primaryBase-10"],
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: theme.radii.small,
    elevation: 3,
  }));
  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
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
  );
};

export default AddCountryTile;
