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

const CALL_BACK_COUNTER_SEC = 180;

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
    if (callBackCounter > 0) {
      const interval = setInterval(() => {
        setCallBackCounter(prevCounter => prevCounter - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callBackCounter]);

  useEffect(() => {
    if (!data) {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const result = await mutateAsync();
      params.onSuccess(result);
      setCallBackCounter(CALL_BACK_COUNTER_SEC);
      setCallRequestedCount(pre => pre + 1);
    } catch (exception) {
      warn("IVR ERROR:", JSON.stringify(exception));
    }
  };

  const renderCounterText = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    } else if (callBackCounter) {
      return (
        <Typography.Text size="callout">
          {t("IvrWaitingScreen.requestACallBack", {
            time: format(addSeconds(new Date(0), callBackCounter), "mm:ss"),
          })}
        </Typography.Text>
      );
    } else if (callRequestedCount < 3) {
      return (
        <Typography.Text onPress={handleSubmit} size="body" weight="medium">
          {t("IvrWaitingScreen.callBackNow")}
        </Typography.Text>
      );
    }
    return null;
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const ivrConfirmButton = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["20p"],
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
            {renderCounterText()}
          </Stack>
        </Stack>
      </ContentContainer>
      {params.varient === "screen" ? (
        <Stack direction="vertical" align="stretch" style={buttonContainerStyle}>
          <Button>{t("IvrWaitingScreen.continue")}</Button>
        </Stack>
      ) : null}
      {/* TODO:JUST FOR TESTING AND WILL BE REMOVED */}
      {params.handleOnIVRConfirm ? (
        <Stack direction="vertical" align="stretch" style={ivrConfirmButton}>
          <Button loading={params.isIVRLoading} onPress={params.handleOnIVRConfirm}>
            {t("IvrWaitingScreen.confirmIVR")}
          </Button>
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
