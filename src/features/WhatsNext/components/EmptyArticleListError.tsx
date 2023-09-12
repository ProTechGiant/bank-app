import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import NoArticlesIcon from "@/assets/icons/NoArticlesIcon";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EmptyArticleListErrorProps {
  hasFilters: boolean;
}

export default function EmptyArticleListError({ hasFilters }: EmptyArticleListErrorProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingTop: theme.spacing["64p"],
    paddingHorizontal: theme.spacing["28p"],
  }));

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <NoArticlesIcon />
      <View style={headingStyle}>
        <Typography.Text size="title3" weight="bold">
          {hasFilters ? t("WhatsNext.HubScreen.noArticlesTitle") : t("WhatsNext.HubScreen.articlesWillBeHerSoonTitle")}
        </Typography.Text>
      </View>
      <Typography.Text color="neutralBase-10" size="callout" align="center">
        {hasFilters
          ? t("WhatsNext.HubScreen.noArticlesDescription")
          : t("WhatsNext.HubScreen.articlesWillBeHerSoonDescription")}
      </Typography.Text>
    </View>
  );
}
