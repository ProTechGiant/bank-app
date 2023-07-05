import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ArticleSectionType } from "../types";
import { getWhatsNextTagColor } from "../utils";
import ExploreCard from "./ExploreCard";

interface RelatedSectionProps {
  data: ArticleSectionType[];
  onArticlePress: (articleId: string) => void;
}

export default function RelatedSection({ data, onArticlePress }: RelatedSectionProps) {
  const { t } = useTranslation();

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <>
      <View style={headerStyle}>
        <Typography.Text size="title3" weight="medium">
          {t("WhatsNext.ExploreArticleScreen.relatedArticles")}
        </Typography.Text>
      </View>
      <Stack gap="16p" direction="vertical">
        {data.map((item, index) => {
          return (
            <View key={index}>
              <ExploreCard
                title={item.Title}
                description={item.SubTitle}
                imageURL={item.Media[0].SourceFileURL}
                tagTitle={item.WhatsNextType}
                tagVariant={getWhatsNextTagColor(item.WhatsNextTypeId)}
                onPress={() => onArticlePress(item.ContentId)}
              />
            </View>
          );
        })}
      </Stack>
    </>
  );
}
