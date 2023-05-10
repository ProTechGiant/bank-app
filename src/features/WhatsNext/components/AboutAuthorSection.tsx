import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useOpenLink from "@/hooks/use-open-link";
import { useThemeStyles } from "@/theme";

import explorePlaceholder from "../assets/explore-placeholder.png";

interface AboutAuthorSectionProps {
  authorSocialMediaName: string;
  authorDescription: string;
  authorSocialMediaLink: string;
}

export default function AboutAuthorSection({
  authorSocialMediaName,
  authorDescription,
  authorSocialMediaLink,
}: AboutAuthorSectionProps) {
  const openLink = useOpenLink();
  const { t } = useTranslation();

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
    flexDirection: "row",
    gap: theme.spacing["12p"],
  }));

  return (
    <>
      <Typography.Text weight="medium" size="title3">
        {t("WhatsNext.ExploreArticleScreen.followWhatsNext")}
      </Typography.Text>
      <View style={contentStyle}>
        {/* TODO: get correct image when available as URL */}
        <Image source={explorePlaceholder} style={styles.image} />
        <View style={styles.column}>
          <Pressable
            onPress={() => {
              openLink(authorSocialMediaLink);
            }}>
            <Typography.Text size="callout" weight="medium" color="primaryBase-40">
              {authorSocialMediaName}
            </Typography.Text>
          </Pressable>
          <Typography.Text size="footnote">{authorDescription}</Typography.Text>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    flex: 1,
  },
  image: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
});
