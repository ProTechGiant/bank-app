import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import NoArticleIcon from "../assets/NoArticleIcon";

interface EmptyArticleListErrorProps {
  hasFilters: boolean;
}

export default function EmptyArticleListError({ hasFilters }: EmptyArticleListErrorProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingTop: 112,
    paddingHorizontal: theme.spacing["32p"],
  }));

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <NoArticleIcon />
      <View style={headingStyle}>
        <Typography.Text size="title1" weight="bold">
          {hasFilters ? t("WhatsNext.HubScreen.noArticlesTitle") : t("WhatsNext.HubScreen.articlesWillBeHerSoonTitle")}
        </Typography.Text>
      </View>
      <Typography.Text color="neutralBase+10" size="callout" align="center">
        {hasFilters
          ? t("WhatsNext.HubScreen.noArticlesDescription")
          : t("WhatsNext.HubScreen.articlesWillBeHerSoonDescription")}
      </Typography.Text>
    </View>
  );
}
