import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import Page from "@/components/Page";
import { useCard } from "@/features/CardActions/hooks/query-hooks";
import MainStackParams from "@/navigation/mainStackParams";

import { CaseType, TransactionType } from "../../types";
import CreateDisputeStep from "./CreateDisputeStep";
import FreezeCardStep from "./FreezeCardStep";
import LandingStep from "./LandingStep";
import SelectDisputeReasonStep from "./SelectDisputeReasonStep";

type Steps = "landing" | "freeze-card" | "reasons" | "create-dispute";

export default function PaymentDisputeScreen() {
  const route = useRoute<RouteProp<MainStackParams, "PaymentDisputes.PaymentDisputeScreen">>();

  // TODO: get cardId
  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  const card = useCard(cardId);

  const [currentStep, setCurrentStep] = useState<Steps>("landing");
  const [previousStep, setPreviousStep] = useState<Steps>("landing");
  // TODO: get transaction type
  const [transactionType, setTransactionType] = useState<TransactionType>("CARD");
  const [reasonCode, setReasonCode] = useState<string | undefined>(undefined);
  const [caseType, setCaseType] = useState<CaseType>("dispute");

  // TODO: get cardType and cardStatus from new endpoint when that's available
  const selectedCard = card.data;
  const cardStatus = selectedCard?.Status;
  const cardType = selectedCard?.CardType;
  const [isCardFrozen, setIsCardFrozen] = useState(cardStatus === "freeze" ? true : false);

  // TEMP: in place so testers know they have used a non-existent card id
  useEffect(() => {
    if (!card.isFetching && card.isSuccess && selectedCard === undefined) {
      Alert.alert("Missing card details", "Card Id doesn't exisit");
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
    if (!isCardFrozen) {
      handleOnNextStep("freeze-card");
    } else {
      handleOnNextStep("create-dispute");
    }
  };

  const handleOnSelectReason = (code: string) => {
    handleOnNextStep("create-dispute");
    setReasonCode(code);
  };

  const handleOnCreateDisputeBack = () => {
    if (!isCardFrozen) {
      handleOnNextStep(previousStep === "freeze-card" ? "freeze-card" : "reasons");
    } else {
      handleOnNextStep(previousStep === "reasons" ? "reasons" : "landing");
    }
  };

  const handleOnCardIsFrozen = (value: boolean) => {
    setIsCardFrozen(value);
  };

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        {selectedCard && cardType && cardStatus !== undefined ? (
          currentStep === "landing" ? (
            <LandingStep
              onProblemWithTransactionLink={handleOnProblemWithTransactionLink}
              onFraudLink={handleOnFraudLink}
            />
          ) : currentStep === "freeze-card" ? (
            <FreezeCardStep
              onClose={() => handleOnNextStep("landing")}
              onContinue={() => handleOnNextStep("create-dispute")}
              isSuccess={card.isSuccess}
              onCardIsFrozen={handleOnCardIsFrozen}
              cardId={cardId}
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
              cardStatus={cardStatus}
              reasonCode={reasonCode}
              transactionType={transactionType}
              createDisputeUserId={createDisputeUserId}
              isCardFrozen={isCardFrozen}
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
