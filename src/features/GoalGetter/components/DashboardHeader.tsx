import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface DashboardHeaderProps {
  username?: string;
}
export default function DashboardHeader({ username }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
    width: "100%",
  }));

  return (
    <>
      <View style={headerStyle}>
        <Typography.Text color="neutralBase-60" size="title2" align="center">
          {t("GoalGetter.GoalDashboardScreen.header")} {username && ""}
          {t("GoalGetter.GoalDashboardScreen.exclamationMark")}
        </Typography.Text>
      </View>
    </>
  );
}
