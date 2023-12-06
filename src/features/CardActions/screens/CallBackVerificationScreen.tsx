import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

import { AlertBox } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useSetPin } from "@/hooks/niSDK/niHooks/use-set-pin";
import { useGetToken } from "@/hooks/use-token";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { NI_ROOT_URL } from "../constants";
import { useCardReplacement } from "../hooks/query-hooks";
import { NIInputInterface } from "../types";

export default function CallBackVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const initialTime = 180; // TODO: set Timer according API
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const useCardReplacementAsync = useCardReplacement();

  const { result: setPinResult, onSetPin, isLoading: setPinLoading, error: pinError } = useSetPin();
  const { mutateAsync, isLoading: getTokenLoading } = useGetToken();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CallBackVerificationScreen">>();

  const cardId = route.params.cardId;
  const reason = route.params.reason.toUpperCase();
  const pin = route.params.pin;

  useEffect(() => {
    if (pinError !== undefined && pinError !== null) setIsErrorModalVisible(true);
  }, [pinError]);

  useEffect(() => {
    if (setPinResult !== null && setPinResult === "OK") {
      navigation.navigate("CardActions.CardActivatedScreen", {
        cardId,
        title: t("CardActions.ActivationScreen.successMessageForReplaceCard"),
        message: t("CardActions.ActivationScreen.successDescriptionForReplaceCard"),
      });
    }
  }, [setPinResult]);

  useEffect(() => {
    replaceCardAPICall();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [navigation, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleOnCancelPress = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Home" });
  };

  const replaceCardAPICall = async () => {
    try {
      const resendResponse = await useCardReplacementAsync.mutateAsync({
        cardId: cardId,
        Reason: reason,
      });

      // Adding temporary time out of 7 seconds untill NI fixes it.
      setTimeout(() => {
        handleOnSetPin(pin, resendResponse.NewCardId);
      }, 7000);
    } catch (error) {
      delayTransition(() => {
        setIsErrorModalVisible(true);
      });
      warn("card-actions", "Could not replace the card ", JSON.stringify(error));
    }
  };

  const handleOnSetPin = async (cardPin: string, cardID: string) => {
    try {
      const response = await mutateAsync();
      if (response) {
        const niInput: NIInputInterface = {
          cardIdentifierType: "EXID",
          cardIdentifierId: cardID,
          bankCode: "CROAT",
          connectionProperties: {
            rootUrl: NI_ROOT_URL,
            token: response.AccessToken,
          },
        };
        onSetPin(cardPin, niInput);
      }
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("CARD-ACTIONS", `Error while getting token: ${JSON.stringify(error)}`);
    }
  };

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["64p"],
    flex: 1,
  }));

  const textPaddingStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    justifyContent: "center",
    alignSelf: "center",
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <>
      {setPinLoading || getTokenLoading ? (
        <FullScreenLoader
          title={t("CardsCallBackVerificationScreen.activatingCardTitleMessage")}
          message={t("CardsCallBackVerificationScreen.activatingCardDescriptionMessage")}
        />
      ) : (
        <Page backgroundColor="neutralBase-60">
          <ContentContainer style={containerStyle}>
            <Stack direction="vertical" justify="space-between" align="center" flex={1}>
              <Stack align="center" direction="vertical" gap="16p" justify="space-between">
                <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                  {t("CardsCallBackVerificationScreen.wellCallYouTitle")}
                </Typography.Text>
                <Typography.Text align="center" color="neutralBase+10" weight="regular" size="callout">
                  {t("CardsCallBackVerificationScreen.callReceiveMessage")}
                </Typography.Text>
              </Stack>
              <View style={textPaddingStyle}>
                <Typography.Text color="neutralBase-20" weight="regular" size="body">
                  {t("CardsCallBackVerificationScreen.callingInMessage")} {String(minutes).padStart(1, "0")}:
                  {String(seconds).padStart(2, "0")} {t("CardsCallBackVerificationScreen.seconds")}
                </Typography.Text>
              </View>
              <Stack align="center" direction="vertical" gap="48p" justify="center">
                <AlertBox description={t("CardsCallBackVerificationScreen.instructionMessage")} />
                <Pressable onPress={handleOnCancelPress} style={buttonStyle}>
                  <Typography.Text color="primaryBase" weight="regular" size="callout">
                    {t("CardsCallBackVerificationScreen.cancel")}
                  </Typography.Text>
                </Pressable>
              </Stack>
            </Stack>
          </ContentContainer>

          <NotificationModal
            variant="error"
            title={t("errors.generic.title")}
            message={t("errors.generic.message")}
            isVisible={isErrorModalVisible}
            onClose={() => {
              setIsErrorModalVisible(false);
              navigation.navigate("Home.HomeTabs", { screen: "Home" });
            }}
          />
        </Page>
      )}
    </>
  );
}
