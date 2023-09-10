import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

import { useChangePOSLimit, useCurrentPOSLimit, usePOSLimits } from "../hooks/query-hooks";
import { mockPOSTransactionLimits } from "../mocks/mockPOSTransactionLimits";
import { ChangePOSLimit } from "../types";

export default function POSLimitScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.POSLimitScreen">>();
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const { isError, isLoading, refetch } = usePOSLimits();
  const { data, isError: currentPOSLimitError, isLoading: currentPOSLimitLoading } = useCurrentPOSLimit(params.cardId);
  const { mutateAsync, isLoading: changePOSLimitLoading } = useChangePOSLimit();
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);
  const [isChangeLimitSuccessModalVisible, setIsChangeLimitSuccessModalVisible] = useState(false);
  const [newPOSLimit, setNewPOSLimit] = useState("5000"); //TODO: replace with original pos limit

  useEffect(() => {
    // setIsLoadingErrorVisible(isError); //TODO: un-comment this when api is developed.
  }, [isError, currentPOSLimitError]);

  const handleOnPOSLimitChange = (value: string) => {
    setNewPOSLimit(value);
  };

  const changePOSLimit = async () => {
    //TODO: replace mocked data with original data.
    const reqData: ChangePOSLimit = {
      CardId: params.cardId,
      CardIdType: "1",
      CardRole: "",
      Value: newPOSLimit,
      Reason: "",
      Limits: [""],
      LimitType: "online_pos_limit",
    };
    try {
      await mutateAsync(reqData);
      setIsChangeLimitSuccessModalVisible(true);
    } catch (error) {
      warn("Card Actions", `Could not change POS limit: ${(error as Error).message}`);
    }
  };

  const handleOnDone = () => {
    if (data) {
      if (Number(data.Value) > Number(newPOSLimit)) {
        otpValidation();
      } else {
        changePOSLimit();
      }
    }
  };

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const handleOnSuccessModalClose = () => {
    setIsChangeLimitSuccessModalVisible(false);
  };

  const otpValidation = async () => {
    otpFlow.handle({
      action: {
        to: "CardActions.POSLimitScreen",
        params: { cardId: params.cardId },
      },
      otpOptionalParams: {
        CardId: params.cardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: async () => {
        return await changePOSLimit();
      },
      onFinish: status => {
        if (status === "fail") {
          setIsLoadingErrorVisible(true);
        }
      },
    });
  };
  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginVertical: theme.spacing["16p"],
  }));

  const posFieldContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
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
                options={mockPOSTransactionLimits}
                variant="small"
                label={t("CardActions.POSLimitScreen.dropDownTitle")}
                value={newPOSLimit}
                onChange={handleOnPOSLimitChange}
              />
              <Stack align="stretch" direction="vertical">
                <Button onPress={handleOnDone} loading={changePOSLimitLoading} disabled={changePOSLimitLoading}>
                  <Typography.Text color="neutralBase-60" size="body" weight="medium">
                    {t("CardActions.POSLimitScreen.doneButton")}
                  </Typography.Text>
                </Button>
                <Button onPress={handleOnCancel} variant="tertiary">
                  <Typography.Text size="body" weight="medium">
                    {t("CardActions.POSLimitScreen.cancelButton")}
                  </Typography.Text>
                </Button>
              </Stack>
            </View>
          </ContentContainer>
        )}
      </Page>
      <LoadingErrorNotification
        isVisible={isLoadingErrorVisible}
        onClose={() => setIsLoadingErrorVisible(false)}
        onRefresh={() => refetch()}
      />
      <NotificationModal
        title={t("CardActions.POSLimitScreen.notificationModelTitle")}
        isVisible={isChangeLimitSuccessModalVisible}
        message={t("CardActions.POSLimitScreen.notificationModelMessage")}
        onClose={handleOnSuccessModalClose}
        variant="success"
      />
    </SafeAreaProvider>
  );
}
