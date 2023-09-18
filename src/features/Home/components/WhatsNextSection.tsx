import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, useWindowDimensions, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useContentArticleList } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Content } from "@/types/Content";

import { SORT_NEWEST, WHATS_NEXT_CATEGORY_ID } from "../constants";
import { ArticleSectionType } from "../types";
import HomeArticleSection from "./HomeArticleSection";
import RefreshSection from "./RefreshSection";
import Section from "./Section";

interface WhatsNextSectionProps {
  onViewAllPress: () => void;
}

export default function WhatsNextSection({ onViewAllPress }: WhatsNextSectionProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const paramsOther: Record<string, string | number> = {
    sort: SORT_NEWEST,
    PageSize: 3,
    PageOffset: 0,
  };
  //refetch will be used when refresh component take place
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, refetch, isLoading } = useContentArticleList(WHATS_NEXT_CATEGORY_ID, true, true, paramsOther);
  const { width } = useWindowDimensions();
  const isRTL = I18nManager.isRTL;
  const currentMonthName = isRTL ? format(new Date(), "MMMM", { locale: arLocale }) : format(new Date(), "MMMM");

  const loadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    height: width - theme.spacing["64p"],
    width: width - theme.spacing["64p"],
    justifyContent: "center",
  }));

  const handleOnTopTenArticlePress = (article: Content) => {
    navigation.navigate("WhatsNext.WhatsNextStack", {
      screen: "WhatsNext.TopTenArticleScreen",
      params: { topTenArticlesData: article },
    });
  };

  return (
    <Section title={t("Home.DashboardScreen.whatsNext", { month: currentMonthName })} onViewAllPress={onViewAllPress}>
      {isLoading ? (
        <View style={loadingContainerStyle}>
          <ActivityIndicator />
        </View>
      ) : data && data.length > 0 ? (
        <HomeArticleSection
          onPress={articleId => {
            const article = data.find(d => d.ContentId === articleId);
            if (article !== undefined) {
              handleOnTopTenArticlePress(article);
            }
          }}
          data={data as ArticleSectionType[]}
        />
      ) : (
        <RefreshSection
          hint={t("Home.RefreshSection.hintForWhatNextArticles")}
          hasIcon={true}
          hasBorder={true}
          onRefreshPress={refetch}
        />
      )}
    </Section>
  );
}
