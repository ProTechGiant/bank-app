import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SORT_NEWEST, SORT_OLDEST } from "../constants";
import { ArticleSectionType } from "../types";
import { getWhatsNextTagColor } from "../utils";
import ExploreCard from "./ExploreCard";

interface ExploreSectionProps {
  data: ArticleSectionType[];
  onArticlePress: (articleId: string) => void;
  onSortByTimePress: () => void;
  sortOrder: typeof SORT_NEWEST | typeof SORT_OLDEST;
}

export default function ExploreSection({ data, onSortByTimePress, sortOrder, onArticlePress }: ExploreSectionProps) {
  const { t } = useTranslation();

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing["32p"],
    paddingBottom: theme.spacing["12p"],
  }));

  return (
    <>
      <View style={headerStyle}>
        <Typography.Text size="callout" weight="medium">
          {t("WhatsNext.HubScreen.explore")}
        </Typography.Text>
        <Pressable style={styles.row} onPress={onSortByTimePress}>
          <Typography.Text size="callout" weight="medium">
            {sortOrder === SORT_NEWEST ? t("WhatsNext.SortingContent.newest") : t("WhatsNext.SortingContent.oldest")}
          </Typography.Text>
          <AngleDownIcon width={16} height={16} />
        </Pressable>
      </View>
      <Stack gap="16p" direction="vertical">
        {data.map((item, index) => {
          return (
            <View key={index}>
              <ExploreCard
                title={item.Title}
                description={item.SubTitle}
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

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
