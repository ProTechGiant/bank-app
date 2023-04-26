import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ArticleSectionType } from "../types";
import ExploreCard from "./ExploreCard";

interface ExploreSectionProps {
  data: ArticleSectionType[];
  onArticlePress: () => void;
  onSortByTimePress: () => void;
}

export default function ExploreSection({ data, onArticlePress, onSortByTimePress }: ExploreSectionProps) {
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
            {t("WhatsNext.HubScreen.newestFirst")}
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
                description={item.ContentDescription}
                tagTitle={item.WhatsNextType}
                tagVariant={
                  item.WhatsNextTypeId === INTERVIEW
                    ? "mint"
                    : item.WhatsNextTypeId === WHATS_NEXT_FOR_ME
                    ? "blue"
                    : item.WhatsNextTypeId === REVIEW
                    ? "purple"
                    : "yellow"
                }
                onPress={onArticlePress}
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

const INTERVIEW = "1";
const WHATS_NEXT_FOR_ME = "2";
const REVIEW = "3";
