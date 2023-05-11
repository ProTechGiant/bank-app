import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ArticleSectionType } from "../types";
import TopTenCard from "./TopTenCard";

interface TopTenSectionProps {
  onPress: (articleId: string) => void;
  data: ArticleSectionType | undefined;
}

export default function TopTenSection({ data, onPress }: TopTenSectionProps) {
  const { t } = useTranslation();

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingRight: theme.spacing["20p"] * 2, // correct for padding twice
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    flexGrow: 0,
  }));

  return (
    <>
      <Typography.Text size="callout" weight="medium">
        {t("WhatsNext.HubScreen.topTen")}
      </Typography.Text>
      <ScrollView
        contentContainerStyle={contentStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={containerStyle}>
        {data?.ChildrenContents?.map((item, index) => {
          return (
            <View key={index}>
              <TopTenCard
                category={item.ContentTag}
                title={item.Title}
                description={item.ContentDescription}
                onPress={() => onPress(item.ContentId)}
              />
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}
