import { ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useThemeStyles } from "@/theme";

import { ArticleSectionType } from "../types";
import ArticleCard from "./ArticleCard";

interface HomeArticleSectionProps {
  onPress: (articleId: string) => void;
  data: ArticleSectionType[];
}

export default function HomeArticleSection({ data, onPress }: HomeArticleSectionProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    flexGrow: 0,
  }));

  return (
    <ScrollView
      contentContainerStyle={contentStyle}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={containerStyle}>
      {data.map(item => {
        return (
          <ArticleCard
            key={item.ContentId}
            imageURL={item?.Media && item.Media[0].SourceFileURL}
            category={item.ContentTag}
            title={item.Title}
            description={item.ContentDescription}
            onPress={() => onPress(item.ContentId)}
          />
        );
      })}
    </ScrollView>
  );
}
