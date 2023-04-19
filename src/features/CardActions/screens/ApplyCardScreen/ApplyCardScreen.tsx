import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Edge } from "react-native-safe-area-context";

import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { PHYSICAL_CARD_TYPE } from "@/constants";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import useOtpFlow from "../../../OneTimePassword/hooks/use-otp";
import ApplyCardsContext, { ApplyCardInput } from "../../context/ApplyCardsContext";
import useSubmitOrderCard from "../../hooks/query-hooks";
import { CardCreateResponse } from "../../types";
import CardOrderedScreen from "./CardOrderedScreen";
import PickCardTypeScreen from "./PickCardTypeScreen";
import SetPinAndAddressScreen from "./SetPinAndAddressScreen";

export default function ApplyCardScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "CardActions.ApplyCardScreen">>();
  const { t } = useTranslation();

  const submitOrderCardAsync = useSubmitOrderCard();
  const otpFlow = useOtpFlow();

  // This needs to be in state because route.params may change during the flow. for example if user selects alternative address
  const [variant, _] = useState(route.params?.replacingCardId !== undefined ? ("renew" as const) : ("apply" as const));
  const [cardCreatedCardId, setCardCreatedCardId] = useState<string | undefined>();
  const [isSubmitErrorVisible, setIsSubmitErrorVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<"pick-type" | "pincode-address" | "ordered">("pick-type");
  const [_rerender, forceUpdate] = useState(0);

  // Need to store in a ref rather than in state, or else the values inside `handleOnSubmit` will lag
  // 1 render and the AlternateAddress is not picked up
  const valuesRef = useRef<ApplyCardInput>({
    CardType: PHYSICAL_CARD_TYPE,
    CardProductId: route.params?.productId,
    EncryptedPincode: undefined,
    AlternateAddress: undefined,
  });

  const handleUpdateContextValue = <T extends keyof ApplyCardInput>(name: T, value: ApplyCardInput[T]) => {
    valuesRef.current = {
      ...valuesRef.current,
      [name]: value,
    };

    forceUpdate(c => c + 1);
  };

  const handleOnSubmit = async () => {
    const values = valuesRef.current;
    if (values.CardProductId === undefined || values.EncryptedPincode === undefined) return;

    try {
      const response = await submitOrderCardAsync.mutateAsync({ values });

      otpFlow.handle<{ CardCreateResponse: CardCreateResponse }>({
        action: {
          to: "CardActions.ApplyCardScreen",
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: response.correlationId,
        },
        otpOptionalParams: {
          Pin: values.EncryptedPincode,
        },
        onOtpRequestResend: () => {
          return submitOrderCardAsync.mutateAsync({ values });
        },
        onFinish: (status, payload) => {
          if (status === "cancel") {
            return;
          }

          if (status === "fail" || payload?.CardCreateResponse?.Header.ErrorId !== "0") {
            setTimeout(() => setIsSubmitErrorVisible(true), TRANSITION_STEP_MS);
            return;
          }

          setCardCreatedCardId(payload.CardCreateResponse.Body.CardId);
          setTimeout(() => setCurrentStep("ordered"), TRANSITION_STEP_MS);
        },
      });
    } catch (error) {
      setIsSubmitErrorVisible(true);
    }
  };

  const handleOnCloseError = () => {
    setIsSubmitErrorVisible(false);
    handleOnCancel();
  };

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const safeAreaInsets = ["top", "left", "right"] as Edge[];
  if (currentStep !== "pick-type") safeAreaInsets.push("bottom");

  return (
    <ApplyCardsContext.Provider value={{ values: valuesRef.current, setValue: handleUpdateContextValue }}>
      {cardCreatedCardId !== undefined ? (
        <CardOrderedScreen cardId={cardCreatedCardId} />
      ) : (
        <>
          <Page backgroundColor="neutralBase-60" insets={safeAreaInsets}>
            {currentStep === "pick-type" ? (
              <PickCardTypeScreen
                onCancel={handleOnCancel}
                onSelected={() => setCurrentStep("pincode-address")}
                variant={variant}
              />
            ) : (
              <SetPinAndAddressScreen
                isSubmitting={submitOrderCardAsync.isLoading}
                onBack={() => setCurrentStep("pick-type")}
                onCancel={handleOnCancel}
                onSubmit={() => handleOnSubmit()}
                variant={variant}
              />
            )}
          </Page>
        </>
      )}
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isSubmitErrorVisible}
        onClose={handleOnCloseError}
      />
    </ApplyCardsContext.Provider>
  );
}

const TRANSITION_STEP_MS = 500;
