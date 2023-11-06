import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ConnnectedServicesCardIcon } from "../assets/icons";
import { ConnectedServicesStatus } from "../constants";
import ConnectedServicesStatusView from "./ConnectedServicesStatusView";

interface ConnectedServicesCardProps {
  title: string;
  status: ConnectedServicesStatus;
  accountsCount: number;
  firstConnected: string;
  lastDataShared?: string;
  connectionExpiry?: string;
  rejectionDate?: string;
  expiryDate?: string;
  disconnectionDate?: string;
}

export default function ConnectedServicesCard({
  title,
  status,
  accountsCount,
  firstConnected,
  connectionExpiry,
  lastDataShared,
  disconnectionDate,
  expiryDate,
  rejectionDate,
}: ConnectedServicesCardProps) {
  const { t } = useTranslation();

  const renderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    marginBottom: theme.spacing["16p"],
  }));

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    marginBottom: theme.spacing["4p"],
  }));

  return (
    <>
      <Stack direction="horizontal" style={renderItemStyle} align="center" justify="space-between">
        <View style={styles.iconContainer}>
          <ConnnectedServicesCardIcon />
        </View>
        <Stack direction="vertical">
          <ConnectedServicesStatusView status={status} />
          <Typography.Text style={titleStyle} size="callout" weight="medium">
            {title}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase-10">
            {accountsCount}
            {accountsCount > 1
              ? t("Settings.ConnectedServicesScreen.accounts")
              : t("Settings.ConnectedServicesScreen.account")}
            {t("Settings.ConnectedServicesScreen.connected")}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase-10">
            {t("Settings.ConnectedServicesScreen.firstConnected")}
            {firstConnected}
          </Typography.Text>

          {status === ConnectedServicesStatus.ACTIVE ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.connectionExpiry")}
              {connectionExpiry}
            </Typography.Text>
          ) : status === ConnectedServicesStatus.REVOKED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.disconnectedOn")}
              {disconnectionDate}
            </Typography.Text>
          ) : status === ConnectedServicesStatus.EXPIRED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.expiredOn")}
              {expiryDate}
            </Typography.Text>
          ) : null}

          {status === ConnectedServicesStatus.REJECTED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.rejectedOn")}
              {rejectionDate}
            </Typography.Text>
          ) : (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.lastDataShared")}
              {lastDataShared}
            </Typography.Text>
          )}
        </Stack>
        <ChevronRightIcon color="#ACABBA" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignSelf: "flex-start",
  },
});
