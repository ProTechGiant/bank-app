import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";

import { SpotIllustrationIcon } from "../assets";
import { useIvrWaitingApi } from "../hooks/query-hooks";

export default function IvrWaitingScreen() {
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<AuthenticatedStackParams | UnAuthenticatedStackParams, "Ivr.IvrWaitingScreen">>();
  const { mutateAsync, isError } = useIvrWaitingApi();

  useEffect(() => {
    if (isError) {
      params.onError();
    }
  }, [isError, params]);

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        apiPath: params.apiPath,
        correlationId: params.correlationId,
        passcode: params.newPasscode,
        isvaUserId: params.isvaUserId,
        workflowTask: params.workflowTask,
        flow: params.flow,
        nationalId: params.nationalId,
        mobileNumber: params.mobileNumber,
      });
      params.onSuccess();
    } catch (exception) {
      warn("Error update user passcode ", JSON.stringify(exception));
    }
  };

  return (
    <ContentContainer style={styles.containerStyle}>
      <Stack direction="vertical" gap="16p" align="center">
        <SpotIllustrationIcon />
        <Typography.Header size="large" weight="semiBold" align="center">
          {t("IvrWaitingScreen.title")}
        </Typography.Header>
        <Stack direction="vertical" align="center" gap="48p">
          <Typography.Text size="callout" align="center">
            {t("IvrWaitingScreen.subTitle")}
            <Typography.Text size="callout" weight="bold">
              {t("IvrWaitingScreen.passcodeSetup")}
            </Typography.Text>
            {t("IvrWaitingScreen.request")}
          </Typography.Text>
          <Typography.Text size="callout">
            {t("IvrWaitingScreen.message", { phoneNumber: "+966 123 456 789" })}
          </Typography.Text>
        </Stack>
      </Stack>
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignContent: "center",
    display: "flex",
    justifyContent: "center",
  },
});
