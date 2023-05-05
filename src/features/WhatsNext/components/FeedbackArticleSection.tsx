import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { ThumbsDownIcon, ThumbsUpIcon } from "@/assets/icons";
import Chip from "@/components/Chip";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface FeedbackArticleSectionProps {
  onPositivePress: () => void;
  onNegativePress: () => void;
}

export default function FeedbackArticleSection({ onPositivePress, onNegativePress }: FeedbackArticleSectionProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderWidth: 1,
    width: "100%",
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["24p"],
  }));

  const descriptionWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text size="callout" weight="medium">
        {t("WhatsNext.ExploreArticleScreen.feedbackTitle")}
      </Typography.Text>
      <View style={descriptionWrapperStyle}>
        <Typography.Text size="footnote" color="neutralBase">
          {t("WhatsNext.ExploreArticleScreen.feedbackDescription")}
        </Typography.Text>
      </View>
      <Stack direction="horizontal" gap="12p">
        <Chip
          title={t("WhatsNext.ExploreArticleScreen.feedbackPositive")}
          onPress={onPositivePress}
          isClosable={false}
          isEnabled={false}
          leftIcon={<ThumbsUpIcon />}
        />
        <Chip
          title={t("WhatsNext.ExploreArticleScreen.feedbackNegative")}
          onPress={onNegativePress}
          isClosable={false}
          isEnabled={false}
          leftIcon={<ThumbsDownIcon />}
        />
      </Stack>
    </View>
  );
}
