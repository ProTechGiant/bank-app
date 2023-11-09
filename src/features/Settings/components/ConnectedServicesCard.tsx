import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ConnnectedServicesCardIcon } from "../assets/icons";
import { ConnectedServicesStatus } from "../constants";
import { TppInfoInterface } from "../types";
import { getTimeDifference } from "../utils/getTimeDifference";
import ConnectedServicesStatusView from "./ConnectedServicesStatusView";

interface ConnectedServicesCardProps {
  tPPInfo: Omit<TppInfoInterface, "TPPId">;
  status: ConnectedServicesStatus;
  accountsNumber: number;
  creationDateTime: string;
  lastDataSharedDateTime: string;
  expirationDateTime: string;
}

export default function ConnectedServicesCard({
  tPPInfo,
  status,
  accountsNumber,
  creationDateTime,
  expirationDateTime,
  lastDataSharedDateTime,
}: ConnectedServicesCardProps) {
  const { t, i18n } = useTranslation();

  const dateFormater = (date?: string) => {
    if (!date) return;
    const validDate = new Date(date);
    return format(validDate, "dd/MM/yyyy");
  };

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
            {i18n.language === "ar" ? tPPInfo.TPPNameArabic : tPPInfo.TPPNameEnglish}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase-10">
            {accountsNumber}
            {accountsNumber > 1
              ? t("Settings.ConnectedServicesScreen.accounts")
              : t("Settings.ConnectedServicesScreen.account")}
            {t("Settings.ConnectedServicesScreen.connected")}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase-10">
            {t("Settings.ConnectedServicesScreen.firstConnected")}
            {dateFormater(creationDateTime)}
          </Typography.Text>

          {status === ConnectedServicesStatus.AUTHORIZED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.connectionExpiry")}
              {dateFormater(expirationDateTime)}
            </Typography.Text>
          ) : status === ConnectedServicesStatus.REVOKED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.disconnectedOn")}
              {dateFormater(expirationDateTime)}
            </Typography.Text>
          ) : status === ConnectedServicesStatus.EXPIRED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.expiredOn")}
              {dateFormater(expirationDateTime)}
            </Typography.Text>
          ) : null}

          {status === ConnectedServicesStatus.REJECTED ? (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.rejectedOn")}
              {dateFormater(expirationDateTime)}
            </Typography.Text>
          ) : (
            <Typography.Text size="footnote" color="neutralBase-10">
              {t("Settings.ConnectedServicesScreen.lastDataShared")}

              {getTimeDifference(lastDataSharedDateTime)}
              {t("Settings.ConnectedServicesScreen.ago")}
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
