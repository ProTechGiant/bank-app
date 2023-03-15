import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { EditBordered } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { mockCountryList } from "@/mocks/countryListData";
import { useThemeStyles } from "@/theme";

interface SelectedForeignTaxCountryCardProps {
  index: number;
  CountryName: string | undefined;
  TaxReferenceNumber: string | undefined;
  onPress: (index: number) => void;
}

export default function SelectedForeignTaxCountryCard({
  index,
  CountryName,
  TaxReferenceNumber,
  onPress,
}: SelectedForeignTaxCountryCardProps) {
  const { t } = useTranslation();

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    minHeight: 100,
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
    <View style={detailsCardStyle}>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="vertical" gap="16p">
          <View>
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("Onboarding.FatcaDetailsScreen.InfoBoxCountryTitle")}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {mockCountryList.find(v => v.value === CountryName)?.label}
            </Typography.Text>
          </View>
          <View>
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("Onboarding.FatcaDetailsScreen.InfoBoxReferenceTitle")}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {TaxReferenceNumber}
            </Typography.Text>
          </View>
        </Stack>
        <Pressable onPress={() => onPress(index)}>
          <EditBordered color={iconColor} />
        </Pressable>
      </Stack>
    </View>
  );
}
