import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { AvatarIcon, ModOffOnIcon } from "../assets/icons";

interface AgentInformationProps {
  isOnline: boolean;
  agentName: string;
}

export default function AgentInformation({ isOnline, agentName }: AgentInformationProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase+30"],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["16p"],
    gap: theme.spacing["4p"],
    borderBottomColor: theme.palette["neutralBase-30"],
    paddingTop: theme.spacing["24p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "column",
    paddingHorizontal: theme.spacing["8p"],
  }));

  const statusContainer = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette.neutralBaseHover,
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  }));

  const iconAvailableColor = useThemeStyles(theme => theme.palette["primaryBase-70"]);
  const iconOfflineColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <View style={containerStyle}>
      <View style={styles.agentInfo}>
        <AvatarIcon />
        <View style={contentContainerStyle}>
          <Typography.Text weight="medium" color="neutralBase-60" size="callout">
            {agentName}
          </Typography.Text>

          <Typography.Text weight="regular" color="neutralBase-10" size="caption1">
            {t("HelpAndSupport.AgentInformation.position")}
          </Typography.Text>
        </View>
      </View>
      <Stack direction="horizontal" gap="8p" style={statusContainer}>
        <ModOffOnIcon color={isOnline ? iconAvailableColor : iconOfflineColor} />
        <Typography.Text weight="medium" color={isOnline ? "primaryBase-70" : "neutralBase"} size="callout">
          {isOnline ? t("HelpAndSupport.AgentInformation.online") : t("HelpAndSupport.AgentInformation.offline")}
        </Typography.Text>
      </Stack>
    </View>
  );
}
const styles = StyleSheet.create({
  agentInfo: {
    alignItems: "center",
    flexDirection: "row",
  },
});
