import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { SearchFailedIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function NoArticlesError() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    padding: theme.spacing["48p"],
  }));

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <SearchFailedIcon />
      <View style={headingStyle}>
        <Typography.Text size="callout" weight="medium">
          {t("WhatsNext.HubScreen.noArticlesTitle")}
        </Typography.Text>
      </View>
      <Typography.Text color="neutralBase-10" size="footnote" align="center">
        {t("WhatsNext.HubScreen.noArticlesDescription")}
      </Typography.Text>
    </View>
  );
}
