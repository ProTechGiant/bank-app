import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { AvatarIcon } from "../assets/icons";

interface AgentInformationProps {
  isOnline: boolean;
  agentName: string;
}

export default function AgentInformation({ isOnline, agentName }: AgentInformationProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["16p"],
    height: theme.spacing["64p"],
    gap: theme.spacing["4p"],
    borderBottomColor: theme.palette["neutralBase-30"],
    borderBottomWidth: 1,
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "column",
    paddingHorizontal: theme.spacing["8p"],
  }));

  const statusCircleStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.medium,
    height: theme.spacing["8p"],
    width: theme.spacing["8p"],
    marginRight: theme.spacing["4p"],
  }));

  const iconAvailableColor = useThemeStyles(theme => theme.palette.secondary_mintBase);
  const iconOfflineColor = useThemeStyles(theme => theme.palette["neutralBase+10"]);

  return (
    <View style={containerStyle}>
      <View style={styles.agentInfo}>
        <AvatarIcon />
        <View style={contentContainerStyle}>
          <Typography.Text weight="medium" color="neutralBase+30" size="callout">
            {agentName}
          </Typography.Text>

          <Typography.Text weight="regular" color="neutralBase+10" size="caption1">
            {t("HelpAndSupport.AgentInformation.position")}
          </Typography.Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[statusCircleStyle, { backgroundColor: isOnline ? iconAvailableColor : iconOfflineColor }]} />
        <Typography.Text weight="medium" color={isOnline ? "secondary_mintBase" : "neutralBase+10"} size="callout">
          {isOnline ? t("HelpAndSupport.AgentInformation.online") : t("HelpAndSupport.AgentInformation.offline")}
        </Typography.Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  agentInfo: {
    alignItems: "center",
    flexDirection: "row",
  },

  statusContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
