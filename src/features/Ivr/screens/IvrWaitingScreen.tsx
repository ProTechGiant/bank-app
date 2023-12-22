import { RouteProp, useRoute } from "@react-navigation/native";
import { addSeconds, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import { SpotIllustrationIcon } from "../assets";
import { useIvrWaitingApi } from "../hooks/query-hooks";

export default function IvrWaitingScreen() {
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<AuthenticatedStackParams | UnAuthenticatedStackParams, "Ivr.IvrWaitingScreen">>();
  const [callBackCounter, setCallBackCounter] = useState(0);
  const [callRequestedCount, setCallRequestedCount] = useState(0);
  const { mutateAsync, isError, data, isLoading } = useIvrWaitingApi(params.onApiCall);

  useEffect(() => {
    if (isError) {
      params.onError();
    }
  }, [isError]);

  useEffect(() => {
    if (callBackCounter <= 0) return;
    const interval = setInterval(() => {
      setCallBackCounter(prevCounter => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callBackCounter]);

  useEffect(() => {
    if (!data) {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await mutateAsync();
      params.onSuccess();
      setCallBackCounter(CALL_BACK_COUNTER_SEC);
      setCallRequestedCount(pre => pre + 1);
    } catch (exception) {
      warn("Error update user passcode ", JSON.stringify(exception));
    }
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page>
      <NavHeader
        onBackPress={() => params.onBack()}
        end={
          params.varient === "modal" ? (
            <Stack as={Pressable} direction="horizontal" onPress={() => params.onBack()}>
              <CloseIcon />
            </Stack>
          ) : undefined
        }
        withBackButton={params.varient === "screen"}
      />
      <ContentContainer style={styles.containerStyle}>
        <Stack direction="vertical" gap="16p" align="center">
          <SpotIllustrationIcon />
          <Typography.Header size="large" weight="semiBold" align="center">
            {t("IvrWaitingScreen.title")}
          </Typography.Header>
          <Stack direction="vertical" align="center" gap="48p">
            <Typography.Text size="callout" align="center">
              {t("IvrWaitingScreen.subTitle")}
            </Typography.Text>
            {isLoading ? (
              <ActivityIndicator />
            ) : callBackCounter ? (
              <Typography.Text size="callout">
                {t("IvrWaitingScreen.requestACallBack", {
                  time: format(addSeconds(new Date(0), callBackCounter), "mm:ss"),
                })}
              </Typography.Text>
            ) : callRequestedCount < 3 ? (
              <Typography.Text onPress={handleSubmit} size="body" weight="medium">
                {t("IvrWaitingScreen.callBackNow")}
              </Typography.Text>
            ) : null}
          </Stack>
        </Stack>
      </ContentContainer>
      {params.varient === "screen" ? (
        <Stack direction="vertical" align="stretch" style={buttonContainerStyle}>
          <Button>{t("IvrWaitingScreen.continue")}</Button>
        </Stack>
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignContent: "center",
    display: "flex",
    justifyContent: "center",
  },
});
const CALL_BACK_COUNTER_SEC = 180;
