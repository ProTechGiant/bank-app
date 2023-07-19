import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import NoArticlesIcon from "../assets/NoArticlesIcon";

export default function NoArticlesError() {
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
          {t("WhatsNext.HubScreen.noArticlesTitle")}
        </Typography.Text>
      </View>
      <Typography.Text color="neutralBase-10" size="callout" align="center">
        {t("WhatsNext.HubScreen.noArticlesDescription")}
      </Typography.Text>
    </View>
  );
}
