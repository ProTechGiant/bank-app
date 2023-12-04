import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Tag from "@/components/Tag";
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
    paddingVertical: theme.spacing["20p"],
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette.neutralBase);
  const getRandomNumber = () => Math.floor(Math.random() * 3) + 1;

  const colorObject = {
    color1: getRandomNumber(),
    color2: getRandomNumber(),
    color3: getRandomNumber(),
  };
  const getColor = (value: number) => {
    switch (value) {
      case 1:
        return "pink";
      case 2:
        return "secondary-mint";
      case 3:
        return "secondary-yellow";
      default:
        return "pink";
    }
  };

  return (
    <View style={detailsCardStyle}>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="vertical" gap="16p">
          <View>
            <Tag
              title={`${mockCountryList.find(v => v.value === CountryName)?.label}`}
              variant={getColor(colorObject.color1)}
            />
          </View>
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("Onboarding.FatcaDetailsScreen.InfoBoxReferenceTitle")}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {TaxReferenceNumber}
            </Typography.Text>
          </Stack>
        </Stack>
        <Pressable
          onPress={() => onPress(index)}
          testID="Onboarding.FatcaDetailsScreen:SelectedForeignTaxCountryEditButton">
          <EditIcon color={iconColor} />
        </Pressable>
      </Stack>
    </View>
  );
}
