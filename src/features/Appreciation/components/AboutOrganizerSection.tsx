import { useTranslation } from "react-i18next";
import { ImageStyle, StyleSheet, useWindowDimensions, View } from "react-native";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface AboutOrganizerSectionProps {
  image: string;
  description: string;
  title: string;
}
export default function AboutOrganizerSection({ image, description, title }: AboutOrganizerSectionProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const imageContainerStyle = useThemeStyles<ImageStyle>(() => ({
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.2,
  }));

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("Appreciation.TermsAndConditionsScreen");
  };

  return (
    <Stack gap="24p" direction="vertical">
      <Typography.Text weight="medium" size="title3">
        {t("Appreciation.AppreciationDetailsSection.AboutTheOrganizer")}
      </Typography.Text>
      <Stack gap="12p" direction="horizontal">
        <NetworkImage source={{ uri: image }} style={imageContainerStyle} resizeMode="stretch" />
        <View style={styles.TermsAndConditionStyle}>
          <Typography.Text weight="medium" size="callout" color="complimentBase">
            {title}
          </Typography.Text>
          <Stack direction="vertical" gap="4p">
            <Typography.Text weight="medium" size="footnote">
              {description}
            </Typography.Text>
            <Stack direction="horizontal" style={styles.TermsAndConditionStyle}>
              <Typography.Text size="footnote">
                {t("Appreciation.AppreciationDetailsSection.readMoreIn")}
              </Typography.Text>
              <Typography.Text size="footnote" color="complimentBase" onPress={handleOnPressTermsAndConditions}>
                {` ${title} ${t("Appreciation.AppreciationDetailsSection.termsAndConditions")}`}
              </Typography.Text>
            </Stack>
          </Stack>
        </View>
      </Stack>
    </Stack>
  );
}
const styles = StyleSheet.create({
  TermsAndConditionStyle: {
    flexShrink: 1,
    width: "70%",
  },
});
