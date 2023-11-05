import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, useWindowDimensions, View, ViewStyle } from "react-native";

import { RefreshSection } from "@/components";
import { useContentArticleList } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SORT_NEWEST, WHATS_NEXT_CATEGORY_ID } from "../constants";
import { ArticleSectionType } from "../types";
import EmptySection from "./EmptySection";
import HomeArticleSection from "./HomeArticleSection";
import Section from "./Section";

interface WhatsNextSectionProps {
  onViewAllPress: () => void;
  testID?: string;
}

export default function WhatsNextSection({ onViewAllPress, testID }: WhatsNextSectionProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const paramsOther: Record<string, string | number> = {
    sort: SORT_NEWEST,
    PageSize: 3,
    PageOffset: 0,
  };
  //refetch will be used when refresh component take place

  const { data, refetch, isLoading, isError } = useContentArticleList(WHATS_NEXT_CATEGORY_ID, true, true, paramsOther);
  const { width } = useWindowDimensions();
  const isRTL = I18nManager.isRTL;
  const currentMonthName = isRTL ? format(new Date(), "MMMM", { locale: arLocale }) : format(new Date(), "MMMM");

  const loadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    height: width - theme.spacing["64p"],
    width: width - theme.spacing["64p"],
    justifyContent: "center",
  }));

  const handleOnExploreArticlePress = (articleId: string) => {
    navigation.navigate("WhatsNext.WhatsNextStack", {
      screen: "WhatsNext.ExploreArticleScreen",

      params: { articleId },
    });
  };

  return (
    <Section
      testID={testID}
      title={t("Home.DashboardScreen.whatsNext", { month: currentMonthName })}
      onViewAllPress={onViewAllPress}>
      {isLoading ? (
        <View style={loadingContainerStyle}>
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <RefreshSection
          testID={testID !== undefined ? `${testID}:RefreshSection` : undefined}
          hint={t("Home.RefreshSection.hintForWhatNextArticles")}
          hasIcon={true}
          hasBorder={true}
          onRefreshPress={refetch}
        />
      ) : data && data.length > 0 ? (
        <HomeArticleSection
          testID={testID !== undefined ? `${testID}:HomeArticleSection` : undefined}
          onPress={articleId => handleOnExploreArticlePress(articleId)}
          data={data as ArticleSectionType[]}
        />
      ) : (
        <EmptySection
          testID={testID !== undefined ? `${testID}:EmptySection` : undefined}
          hint={t("Home.EmptySection.hintForWhatNextArticles")}
        />
      )}
    </Section>
  );
}
