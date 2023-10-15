import { Image, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import BenefitImage from "../assets/BenefitImage.png";
import AllInOneTag from "./AllInOneTag";

export default function BenefitsItem() {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    maxWidth: 200,
    marginTop: -theme.spacing["16p"],
  }));

  const { borderTopStartRadius: topRadius, borderBottomStartRadius: bottomRadius } = useThemeStyles<ViewStyle>(
    theme => ({
      borderTopStartRadius: theme.radii.small,
      borderBottomStartRadius: theme.radii.small,
    })
  );

  return (
    <View style={containerStyle}>
      <Image
        resizeMode="contain"
        source={BenefitImage}
        style={{ borderTopLeftRadius: topRadius, borderBottomLeftRadius: bottomRadius }}
      />
      <Stack direction="vertical" style={textContainerStyle} align="flex-start" justify="center" gap="4p">
        <AllInOneTag label="Free" backgroundColor="#E8D06B" />
        {/* TODO : WHEN API/LLD Available , we will replace these hardcoded values  */}
        <Typography.Text size="callout" weight="medium">
          Choose Your Benefits
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular">
          Customize your package to match your preferences and needs.
        </Typography.Text>
      </Stack>
    </View>
  );
}
