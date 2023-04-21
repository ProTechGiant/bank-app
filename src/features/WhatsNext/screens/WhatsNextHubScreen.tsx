import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import { FilterIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import { LoadingErrorPage } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ExploreCard, TopTenCard } from "../components";
import { WhatsNextMocks } from "../whatsNextMocks";

export default function WhatsNextHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnLoadingErrorRefresh = () => {
    //@TODO refetch data
  };

  const handleOnSortByTimePress = () => {
    Alert.alert("Sort by asc/desc will be handled here");
  };

  const handleOnFiltersPress = () => {
    Alert.alert("Filters will be handled here");
  };

  const handleOnExploreArticlePress = () => {
    navigation.navigate("WhatsNext.ExploreArticleScreen");
  };

  const handleOnTopTenArticlePress = () => {
    navigation.navigate("WhatsNext.TopTenArticleScreen");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingRight: theme.spacing["20p"] * 2, // correct for padding twice
  }));

  const exploreHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing["32p"],
    paddingBottom: theme.spacing["12p"],
  }));

  return (
    <>
      {WhatsNextMocks !== undefined ? (
        <Page backgroundColor="neutralBase-60">
          <NavHeader
            title={t("WhatsNext.HubScreen.title")}
            end={
              <Pressable onPress={handleOnFiltersPress}>
                <FilterIcon />
              </Pressable>
            }
          />

          <ContentContainer isScrollView>
            <Typography.Text size="callout" weight="medium">
              {t("WhatsNext.HubScreen.topTen")}
            </Typography.Text>
            <ScrollView
              contentContainerStyle={contentStyle}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={containerStyle}>
              {WhatsNextMocks.map(data => {
                if (data.ContentTag === "Top 10" && data.ContentCategoryId === "WhatsNext") {
                  return data.ChildrenContents.map((topTenContent, index) => {
                    return (
                      <View key={index}>
                        <TopTenCard
                          category={topTenContent.ContentTag}
                          title={topTenContent.Title}
                          description={topTenContent.ContentDescription}
                          onPress={handleOnTopTenArticlePress}
                        />
                      </View>
                    );
                  });
                }
              })}
            </ScrollView>
            <View style={exploreHeaderStyle}>
              <Typography.Text size="callout" weight="medium">
                {t("WhatsNext.HubScreen.explore")}
              </Typography.Text>
              <Pressable style={styles.row} onPress={handleOnSortByTimePress}>
                <Typography.Text size="callout" weight="medium">
                  {t("WhatsNext.HubScreen.newestFirst")}
                </Typography.Text>
                <AngleDownIcon width={16} height={16} />
              </Pressable>
            </View>
            <Stack gap="16p" direction="vertical">
              {WhatsNextMocks.map((data, index) => {
                if (data.ContentTag === "explore") {
                  return (
                    <View key={index}>
                      <ExploreCard
                        title={data.Title}
                        description={data.ContentDescription}
                        tagTitle={data.WhatsNextType}
                        tagVariant={
                          data.WhatsNextTypeId === "1"
                            ? "mint"
                            : data.WhatsNextTypeId === "2"
                            ? "blue"
                            : data.WhatsNextTypeId === "3"
                            ? "purple"
                            : "yellow"
                        }
                        onPress={handleOnExploreArticlePress}
                      />
                    </View>
                  );
                }
              })}
            </Stack>
          </ContentContainer>
        </Page>
      ) : (
        <LoadingErrorPage onRefresh={handleOnLoadingErrorRefresh} />
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
