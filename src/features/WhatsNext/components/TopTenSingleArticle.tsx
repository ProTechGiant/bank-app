import { ImageBackground, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import topTenPlacePlaceholder from "../assets/top-ten-article-placeholder.png";
import { ArticleSectionType } from "../types";

interface TopTenSingleArticleProps {
  item: ArticleSectionType;
  handleShowDetails: () => void;
  showDetails: boolean;
}
import { useTranslation } from "react-i18next";

export default function TopTenSingleArticle({ item, handleShowDetails, showDetails }: TopTenSingleArticleProps) {
  const { WhatsNextCategory, Title, ContentDescription, EventDetails } = item;
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();

  const articleContainer = useThemeStyles<ViewStyle>(theme => ({
    width,
    height,
  }));

  const articleBottom = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
    position: "absolute",
    bottom: 82,
    width,
  }));

  const articleBottomTitle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const articleBottomDescription = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  const detailsTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <ImageBackground resizeMode="cover" source={topTenPlacePlaceholder} blurRadius={showDetails ? 5 : 0}>
      <View style={articleContainer}>
        <View style={articleBottom}>
          <Typography.Text color="neutralBase-60" size="caption2" weight="medium">
            {WhatsNextCategory}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" size="title2" weight="medium" style={articleBottomTitle}>
            {Title}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" size="caption1">
            {t("WhatsNext.TopTenArticle.openingHours")} {EventDetails.OpeningHours}
          </Typography.Text>

          <Pressable onPress={handleShowDetails}>
            <Typography.Text
              color="neutralBase-60"
              size="callout"
              style={articleBottomDescription}
              numberOfLines={showDetails ? undefined : 3}>
              {ContentDescription}
            </Typography.Text>
            {showDetails !== false ? (
              <Stack direction="horizontal" gap="24p">
                <Stack direction="vertical" style={styles.columnStyle}>
                  <View style={detailsTitleStyle}>
                    <Typography.Text color="neutralBase-60" size="callout" weight="medium">
                      {t("WhatsNext.TopTenArticle.location")}
                    </Typography.Text>
                  </View>
                  <Typography.Text color="neutralBase-60" size="caption1" weight="regular">
                    {EventDetails.Location}
                  </Typography.Text>
                </Stack>
                <Stack direction="vertical" style={styles.columnStyle}>
                  <View style={detailsTitleStyle}>
                    <Typography.Text color="neutralBase-60" size="callout" weight="medium">
                      {t("WhatsNext.TopTenArticle.price")}
                    </Typography.Text>
                  </View>
                  <Typography.Text color="neutralBase-60" size="caption1" weight="regular">
                    {EventDetails.Price} {t("WhatsNext.TopTenArticle.currency")}
                  </Typography.Text>
                </Stack>
              </Stack>
            ) : null}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  columnStyle: {
    width: "50%",
  },
});
