import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { EditBorderedIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
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
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    minHeight: 100,
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <WithShadow backgroundColor="neutralBase-50" borderRadius="small" elevation={3}>
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
            <EditBorderedIcon color={iconColor} />
          </Pressable>
        </Stack>
      </View>
    </WithShadow>
  );
}
