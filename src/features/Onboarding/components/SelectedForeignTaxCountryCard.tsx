import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import RightArrow from "@/features/ViewTransactions/assets/icons/RightArrow";
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
    borderWidth: 1,
    borderRadius: 16,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const countryStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    borderRadius: theme.spacing["4p"],
    backgroundColor:
      index === 0
        ? theme.palette["secondary_blueBase-20"]
        : index === 1
        ? theme.palette["secondary_yellowBase-30"]
        : theme.palette["secondary_mintBase-20"],
  }));

  return (
    <Pressable style={detailsCardStyle} onPress={() => onPress(index)}>
      <Stack direction="horizontal" justify="space-between" align="center">
        <Stack direction="vertical" gap="16p">
          <View style={countryStyle}>
            <Typography.Text
              size="footnote"
              weight="regular"
              color="neutralBase+30"
              testID="Onboarding.FatcaDetailsScreen:SelectedForeignTaxCountryName">
              {mockCountryList.find(v => v.value === CountryName)?.label}
            </Typography.Text>
          </View>
          <Stack direction="horizontal" align="center">
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("Onboarding.FatcaDetailsScreen.utr")}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {TaxReferenceNumber?.substring(0, 4)} {TaxReferenceNumber?.substring(4, 8)}{" "}
              {TaxReferenceNumber?.substring(8, 12)}
            </Typography.Text>
          </Stack>
        </Stack>
        <RightArrow />
      </Stack>
    </Pressable>
  );
}
