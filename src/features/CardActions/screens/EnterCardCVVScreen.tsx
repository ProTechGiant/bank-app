import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import encryptValue from "@/utils/encrypt-value";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { useOtpFlow } from "../../OneTimePassword/hooks/query-hooks";
import { CardActionsStackParams } from "../CardActionsStack";
import ViewCVVModel from "../components/ViewCVVModel";
import { useChangeCardStatus, useVerifyCVV } from "../hooks/query-hooks";

export default function EnterCardCVVScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.EnterCardCVVScreen">>();

  const cardId = route.params.cardId;
  const enterCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(NUMBER_OF_RETRIES);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isViewingCVVHint, setIsViewingCVVHint] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const verifyCVVAsync = useVerifyCVV();
  const changeCardStatusAsync = useChangeCardStatus();
  const otpFlow = useOtpFlow();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnChangeText = (input: string) => {
    const normalizedValue = westernArabicNumerals(input);

    setIsErrorVisible(false);
    setCurrentValue(normalizedValue);

    if (normalizedValue.length !== INPUT_SIZE) return;
    handleOnVerifyCVV(normalizedValue);
  };

  const handleOnVerifyCVV = async (value: string) => {
    const cvv = encryptValue(value);
    try {
      const response = await verifyCVVAsync.mutateAsync({ cardId, cvv });
      if (response.Message === "Cvv verified successfully") {
        handleOnUnfreezeCard();
      } else {
        setRemainingAttempts(current => current - 1);
        setIsErrorVisible(true);
        setCurrentValue("");
      }
    } catch (error) {
      setCurrentValue("");
      setIsErrorModalVisible(true);
      warn("Could not validate CVV: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCard = async () => {
    try {
      const response = await changeCardStatusAsync.mutateAsync({ cardId, status: "unfreeze" });

      otpFlow.handle({
        action: {
          to: "CardActions.EnterCardCVVScreen",
        },
        otpOptionalParams: {
          CardId: cardId,
          IsActivation: true, // for card activation
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: response.correlationId,
          otpFormType: "card-actions",
        },
        onOtpRequestResend: () => {
          return changeCardStatusAsync.mutateAsync({ cardId, status: "unfreeze" });
        },
        onFinish: status => {
          if (status === "cancel") {
            return;
          }
          if (status === "fail") {
            setIsErrorModalVisible(true);
            return;
          }
          navigation.navigate("CardActions.CardActivatedScreen", { cardId });
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["16p"],
    rowGap: theme.spacing["10p"],
    width: "100%",
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("CardActions.EnterCardCVVScreen.navTitle")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={35} style={{ flex: 1 }}>
          <ContentContainer>
            <Stack align="center" direction="vertical" justify="space-between" flex={1}>
              <Stack align="center" direction="vertical" gap="16p">
                <Stack direction="vertical" gap="16p">
                  <Typography.Text color="neutralBase+30" size="title1" weight="semiBold">
                    {t("CardActions.EnterCardCVVScreen.title")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    {t("CardActions.EnterCardCVVScreen.content")}
                  </Typography.Text>
                </Stack>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={enterCodeRef}
                    isError={remainingAttempts === 0}
                    autoFocus
                    onChangeText={handleOnChangeText}
                    length={INPUT_SIZE}
                    value={currentValue}
                  />
                  {isErrorVisible && remainingAttempts > 0 ? (
                    <InlineBanner
                      icon={<ErrorFilledCircleIcon />}
                      text={t("CardActions.EnterCardCVVScreen.errorCVV", { count: remainingAttempts })}
                      variant="error"
                    />
                  ) : null}
                </View>
                <Button variant="tertiary" onPress={() => setIsViewingCVVHint(true)}>
                  {t("CardActions.EnterCardCVVScreen.hint")}
                </Button>
              </Stack>
            </Stack>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        buttons={{
          primary: <Button onPress={() => handleOnBackPress()}>{t("CardActions.EnterCardCVVScreen.button")}</Button>,
        }}
        title={t("CardActions.EnterCardCVVScreen.errorTitle")}
        message={t("CardActions.EnterCardCVVScreen.errorMessage")}
        isVisible={isErrorVisible && remainingAttempts === 0}
        variant="error"
      />
      <NotificationModal
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        variant="error"
        onClose={() => handleOnBackPress()}
      />
      <ViewCVVModel isVisible={isViewingCVVHint} onClose={() => setIsViewingCVVHint(false)} />
    </>
  );
}

const INPUT_SIZE = 3;
const NUMBER_OF_RETRIES = 3;
