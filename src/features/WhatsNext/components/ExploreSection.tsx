import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
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
  isLoading: boolean;
}

export default function ExploreSection({
  data,
  onSortByTimePress,
  sortOrder,
  onArticlePress,
  isLoading,
}: ExploreSectionProps) {
  const { t } = useTranslation();

  const iconColor = useThemeStyles<string>(theme => theme.palette.complimentBase);

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing["32p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <>
      <View style={headerStyle}>
        <Typography.Text size="callout" weight="medium">
          {t("WhatsNext.HubScreen.explore")}
        </Typography.Text>
        <Pressable style={styles.row} onPress={onSortByTimePress}>
          <Stack direction="horizontal" gap="8p">
            <Typography.Text size="callout" weight="regular" color="complimentBase">
              {sortOrder === SORT_NEWEST ? t("WhatsNext.SortingContent.newest") : t("WhatsNext.SortingContent.oldest")}
            </Typography.Text>
            <AngleDownIcon width={20} height={20} color={iconColor} />
          </Stack>
        </Pressable>
      </View>
      {!isLoading ? (
        <Stack gap="20p" direction="vertical">
          {data?.map((item, index) => {
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
      ) : (
        <FlexActivityIndicator />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
