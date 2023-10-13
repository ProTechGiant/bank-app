import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import { DropdownInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { CardActionsStackParams } from "../CardActionsStack";
import { useChangePOSLimit, useCurrentPOSLimit, usePOSLimits } from "../hooks/query-hooks";
import { ChangePOSLimit } from "../types";

export default function POSLimitScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<CardActionsStackParams, "CardActions.POSLimitScreen">>();
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const { data: posLimits, isError, isLoading, refetch } = usePOSLimits();
  const {
    data: currentPosLimit,
    isError: currentPOSLimitError,
    isLoading: currentPOSLimitLoading,
  } = useCurrentPOSLimit(params.cardId);
  const { mutateAsync, isLoading: changePOSLimitLoading } = useChangePOSLimit();
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);
  const [isChangeLimitSuccessModalVisible, setIsChangeLimitSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [newPOSLimit, setNewPOSLimit] = useState("");

  useEffect(() => {
    setIsLoadingErrorVisible(isError || currentPOSLimitError);
  }, [isError, currentPOSLimitError]);

  useEffect(() => {
    if (currentPosLimit) setNewPOSLimit(`${currentPosLimit.Value}`);
  }, [currentPosLimit]);

  const handleOnPOSLimitChange = (value: string) => {
    setNewPOSLimit(value);
  };

  const handleOnDone = async () => {
    const reqData: ChangePOSLimit = {
      CardId: params.cardId,
      CardIdType: "EXID",
      Reason: "Increasing card limit",
      Limits: {
        LimitType: "online_pos_limit",
        Currency: "SAR",
        Value: newPOSLimit,
      },
    };
    try {
      const response = await mutateAsync(reqData);
      if (response.IsOtpRequired) {
        otpFlow.handle({
          action: {
            to: "CardActions.POSLimitScreen",
            params: { cardId: params.cardId },
          },
          otpOptionalParams: {
            CardId: params.cardId,
          },
          otpChallengeParams: {
            OtpId: response.OtpId,
            PhoneNumber: response.PhoneNumber,
          },
          otpVerifyMethod: "card-actions",
          onOtpRequest: () => {
            return mutateAsync(reqData);
          },
          onFinish: status => {
            if (status === "success") {
              setIsChangeLimitSuccessModalVisible(true);
            } else {
              setIsErrorModalVisible(true);
            }
          },
        });
      } else setIsChangeLimitSuccessModalVisible(true);
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("Card Actions", `Could not change POS limit: ${(error as Error).message}`);
    }
  };

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const handleOnSuccessModalClose = () => {
    setIsChangeLimitSuccessModalVisible(false);
  };

  const posTransactionLimits = useMemo(() => {
    if (posLimits === undefined) return [];

    return posLimits.Limits.map(element => ({
      label: I18nManager.isRTL
        ? `${formatCurrency(Number(element))} ${t("CardActions.POSLimitScreen.currency")}`
        : `${t("CardActions.POSLimitScreen.currency")} ${formatCurrency(Number(element))}`,
      value: element,
    }));
  }, [posLimits, t]);

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginTop: theme.spacing["4p"],
  }));

  const posFieldContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} testID="CardActions.POSLimitScreen:NavHeader" />
      {isLoading || currentPOSLimitLoading ? (
        <FullScreenLoader />
      ) : (
        <ContentContainer style={mainContainerStyle}>
          <Stack direction="vertical" gap="8p">
            <Typography.Text color="neutralBase+30" size="title1" weight="regular">
              {t("CardActions.POSLimitScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase+20" weight="regular">
              {t("CardActions.POSLimitScreen.subTitle")}
            </Typography.Text>
          </Stack>
          <View style={posFieldContainerStyle}>
            <DropdownInput
              autoselect={false}
              buttonLabel={t("CardActions.POSLimitScreen.doneButton")}
              isFixedHeight
              headerText={t("CardActions.POSLimitScreen.dropDownTitle")}
              options={posTransactionLimits}
              variant="small"
              label={t("CardActions.POSLimitScreen.dropDownTitle")}
              value={newPOSLimit}
              onChange={handleOnPOSLimitChange}
              testID="CardActions.POSLimitScreen:TransactionLimitInput"
            />
            <Stack align="stretch" direction="vertical">
              <Button
                onPress={handleOnDone}
                loading={changePOSLimitLoading}
                disabled={changePOSLimitLoading}
                testID="CardActions.POSLimitScreen:DoneButton">
                <Typography.Text color="neutralBase-60" size="body" weight="medium">
                  {t("CardActions.POSLimitScreen.doneButton")}
                </Typography.Text>
              </Button>
              <Button onPress={handleOnCancel} variant="tertiary" testID="CardActions.POSLimitScreen:CancelButton">
                <Typography.Text size="body" weight="medium">
                  {t("CardActions.POSLimitScreen.cancelButton")}
                </Typography.Text>
              </Button>
            </Stack>
          </View>
        </ContentContainer>
      )}
      <LoadingErrorNotification
        isVisible={isLoadingErrorVisible}
        onClose={() => setIsLoadingErrorVisible(false)}
        onRefresh={() => refetch()}
      />
      <NotificationModal
        title={t("CardActions.POSLimitScreen.successModal.title")}
        isVisible={isChangeLimitSuccessModalVisible}
        message={t("CardActions.POSLimitScreen.successModal.message")}
        onClose={handleOnSuccessModalClose}
        variant="success"
        buttons={{
          primary: (
            <Button onPress={handleOnSuccessModalClose} testID="CardActions.POSLimitScreen:SuccessModalOkButton">
              {t("CardActions.POSLimitScreen.successModal.okButton")}
            </Button>
          ),
        }}
        testID="CardActions.POSLimitScreen:SuccessModal"
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </Page>
  );
}
