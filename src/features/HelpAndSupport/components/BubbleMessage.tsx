import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { AgentAvatarIcon, SenderAvatarIcon } from "../assets/icons";

interface BubbleMessageProps {
  isAgent: boolean;
  message: string;
  time: string;
}

export default function BubbleMessage({ isAgent, message, time }: BubbleMessageProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    margin: theme.spacing["16p"],
    display: "flex",
    alignItems: "flex-start",
  }));

  const agentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: theme.spacing["12p"],
    paddingRight: theme.spacing["32p"],
  }));

  const agentInfoStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["8p"],
    flex: 1,
  }));

  const agentMessageStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    minHeight: theme.spacing["48p"],
    marginHorizontal: theme.spacing["4p"],
    marginVertical: theme.spacing["20p"],
    borderBottomLeftRadius: theme.spacing["8p"],
    borderBottomRightRadius: theme.spacing["8p"],
    borderTopRightRadius: theme.spacing["8p"],
    justifyContent: "center",
    padding: theme.spacing["8p"],
  }));

  const customerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: theme.spacing["32p"],
    paddingRight: theme.spacing["16p"],
  }));

  const customerMessageStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-30"],
    minHeight: theme.spacing["64p"],
    padding: theme.spacing["8p"],
    borderTopLeftRadius: theme.spacing["8p"],
    borderBottomLeftRadius: theme.spacing["8p"],
    borderBottomRightRadius: theme.spacing["8p"],
    marginVertical: theme.spacing["12p"],
  }));

  const senderSvgStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      {isAgent ? (
        <View style={agentContainerStyle}>
          <View style={agentInfoStyle}>
            <View style={styles.flexDirectionRow}>
              <AgentAvatarIcon />
              <View style={styles.contentStyle}>
                <View style={[styles.flexDirectionRow, styles.justifyContentSpaceBetween]}>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    {t("HelpAndSupport.BubbleMessage.croatiaAgent")}
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
              <Typography.Text size="callout" weight="regular" color="supportBase-30">
                {message}
              </Typography.Text>
            </View>
          </View>
          <View style={senderSvgStyle}>
            <SenderAvatarIcon />
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
  },
  customerInfoStyle: {
    flex: 1,
    justifyContent: "space-between",
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  justifyContentSpaceBetween: {
    justifyContent: "space-between",
  },
});
