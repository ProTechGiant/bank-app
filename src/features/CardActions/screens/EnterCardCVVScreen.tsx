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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { CardActionsStackParams } from "../CardActionsStack";
import ViewCVVModel from "../components/ViewCVVModel";

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

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnChangeText = (input: string) => {
    if (remainingAttempts < 1) return;
    const normalizedValue = westernArabicNumerals(input);

    setIsErrorVisible(false);
    setCurrentValue(normalizedValue);

    if (normalizedValue.length !== INPUT_SIZE) return;

    // OTP Code
    handleOnValidateCVV();
  };

  const handleOnValidateCVV = async () => {
    if (undefined === currentValue) return;
    // @todo add  BE integration
    // setRemainingAttempts(current => current - 1);
    // setIsErrorVisible(true);

    navigation.navigate("CardActions.CardActivatedScreen", { cardId });
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
      <ViewCVVModel isVisible={isViewingCVVHint} onClose={() => setIsViewingCVVHint(false)} />
    </>
  );
}

const INPUT_SIZE = 3;
const NUMBER_OF_RETRIES = 3;
