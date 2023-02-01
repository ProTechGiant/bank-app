import { Pressable, View, ViewStyle } from "react-native";

import { EditBordered } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface SelectedFtrCountry {
  index: number;
  country: string;
  uniqueReference: string;
}

const SelectedFtrCard = ({ index, country, uniqueReference }: SelectedFtrCountry) => {
  const navigation = useNavigation();
  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
    minHeight: 100,
  }));
  const edit = () => {
    navigation.navigate("Onboarding.CountrySelector", {
      index: { index },
      country: { country },
      uniqueReference: { uniqueReference },
    });
  };

  return (
    <View style={detailsCardStyle} key={uniqueReference}>
      <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
        <Stack direction="vertical" gap="medium">
          <View>
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              Country
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {country}
            </Typography.Text>
          </View>
          <View>
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              Unique Reference
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {uniqueReference}
            </Typography.Text>
          </View>
        </Stack>
        <Pressable onPress={edit}>
          <EditBordered />
        </Pressable>
      </Stack>
    </View>
  );
};

export default SelectedFtrCard;
