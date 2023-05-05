import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import Page from "@/components/Page";
import { useCard, useFreezeCard } from "@/features/CardActions/hooks/query-hooks";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import { generateRandomId } from "@/utils";

import { CaseType, TransactionType } from "../types";
import { CreateDisputeStep, FreezeCardStep, LandingStep, SelectDisputeReasonStep } from "./index";

type Steps = "landing" | "freeze-card" | "reasons" | "create-dispute";

export default function PaymentDisputeScreen() {
  const route = useRoute<RouteProp<MainStackParams, "PaymentDisputes.PaymentDisputeScreen">>();

  const [currentStep, setCurrentStep] = useState<Steps>("landing");
  const [previousStep, setPreviousStep] = useState<Steps>("landing");
  // TODO: get transaction type
  const [transactionType, setTransactionType] = useState<TransactionType>("ATM");
  // TODO: get cardId
  const cardId = route.params.cardId;
  const [reasonCode, setReasonCode] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("dispute");
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const card = useCard(cardId);
  const freezeCardAsync = useFreezeCard();

  // TODO: get cardtype and cardstatus from new endpoint when that's available
  const selectedCard = card.data;
  const cardStatus = selectedCard?.Status;
  const cardType = selectedCard?.CardType;

  // TEMP: in place so testers know they have used a non-existent card id
  useEffect(() => {
    if (!card.isFetching && card.isSuccess && selectedCard === undefined) {
      Alert.alert("Missing card details", "Card Id doesn't exist");
    }
  }, [card.isFetching, card.isSuccess, selectedCard]);

  const handleOnNextStep = (newStep: Steps) => {
    setPreviousStep(currentStep);
    setCurrentStep(newStep);
  };

  const handleOnProblemWithTransactionLink = () => {
    setCurrentStep("reasons");
    setCaseType("dispute");
  };

  const handleOnFraudLink = () => {
    setCaseType("fraud");
    if (cardStatus === "unfreeze") {
      handleOnNextStep("freeze-card");
    } else {
      handleOnNextStep("create-dispute");
    }
  };

  const handleOnFreezeCardPress = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });
      if (response.Status !== "freeze") throw new Error("Received unexpected response from backend");
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnSelectReason = (code: string) => {
    handleOnNextStep("create-dispute");
    setReasonCode(code);
  };

  const handleOnCreateDisputeBack = () => {
    if (cardStatus === "unfreeze") {
      handleOnNextStep(previousStep === "freeze-card" ? "freeze-card" : "reasons");
    } else {
      handleOnNextStep(previousStep === "reasons" ? "reasons" : "landing");
    }
  };

  const handleOnPressCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        {card.data !== undefined ? (
          currentStep === "landing" ? (
            <LandingStep
              onProblemWithTransactionLink={handleOnProblemWithTransactionLink}
              onFraudLink={handleOnFraudLink}
            />
          ) : currentStep === "freeze-card" ? (
            <FreezeCardStep
              onClose={() => handleOnNextStep("landing")}
              onContinue={() => handleOnNextStep("create-dispute")}
              onFreezeCardPress={handleOnFreezeCardPress}
              isSuccess={card.isSuccess}
              isError={isErrorModalVisible}
              onPressCloseErrorModal={handleOnPressCloseErrorModal}
            />
          ) : currentStep === "reasons" ? (
            <SelectDisputeReasonStep
              transactionType={transactionType}
              onBack={() => handleOnNextStep("landing")}
              onSelectReason={handleOnSelectReason}
            />
          ) : (
            <CreateDisputeStep
              caseType={caseType}
              cardType={cardType}
              reasonCode={reasonCode}
              onBack={handleOnCreateDisputeBack}
            />
          )
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
    </SafeAreaProvider>
  );
}
