import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SenderAvatarIcon } from "../assets/icons";
import { AgentAvatar } from "../components";

interface BubbleMessageProps {
  isAgent: boolean;
  isAgentOnline: boolean;
  message: string;
  time: string;
  agentName: string;
}

export default function BubbleMessage({ isAgent, message, time, agentName, isAgentOnline }: BubbleMessageProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    marginBottom: theme.spacing["24p"],
  }));

  const agentMessageStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["secondary_blueBase-20"],
    borderBottomLeftRadius: theme.spacing["16p"],
    borderBottomRightRadius: theme.spacing["16p"],
    borderTopRightRadius: theme.spacing["8p"],
    justifyContent: "center",
    padding: theme.spacing["8p"],
  }));

  const customerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing["12p"],
  }));

  const customerMessageStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["secondary_purpleBase-20"],
    padding: theme.spacing["8p"],
    borderTopLeftRadius: theme.spacing["8p"],
    borderBottomLeftRadius: theme.spacing["16p"],
    borderBottomRightRadius: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      {isAgent ? (
        <View style={styles.agentContainerStyle}>
          <View style={styles.agentInfoStyle}>
            <View style={styles.flexDirectionRow}>
              <AgentAvatar isOnline={isAgentOnline} />
              <View style={styles.contentStyle}>
                <View style={[styles.flexDirectionRow, styles.justifyContentSpaceBetween]}>
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                    {agentName}
                  </Typography.Text>

                  <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                    {time}
                  </Typography.Text>
                </View>
                <View style={agentMessageStyle}>
                  <Typography.Text size="callout" weight="regular" color="neutralBase+30">
                    {message}
                  </Typography.Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={customerContainerStyle}>
          <View style={styles.customerInfoStyle}>
            <View style={[styles.flexDirectionRow, styles.justifyContentSpaceBetween]}>
              <Typography.Text size="footnote" weight="medium" color="neutralBase+30">
                {t("HelpAndSupport.BubbleMessage.you")}
              </Typography.Text>
              <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                {time}
              </Typography.Text>
            </View>
            <View style={customerMessageStyle}>
              <Typography.Text size="callout" weight="regular" color="neutralBase+30">
                {message}
              </Typography.Text>
            </View>
          </View>
          <SenderAvatarIcon />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  agentContainerStyle: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  agentInfoStyle: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    rowGap: 6,
  },
  customerInfoStyle: {
    flex: 1,
    justifyContent: "space-between",
    rowGap: 6,
  },
  flexDirectionRow: {
    flexDirection: "row",
    gap: 12,
  },
  justifyContentSpaceBetween: {
    justifyContent: "space-between",
  },
});
