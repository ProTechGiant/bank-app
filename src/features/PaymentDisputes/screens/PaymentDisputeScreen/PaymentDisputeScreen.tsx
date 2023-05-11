import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useCard } from "@/features/CardActions/hooks/query-hooks";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import { CaseType, TransactionType } from "../../types";
import CreateDisputeStep from "./CreateDisputeStep";
import FreezeCardStep from "./FreezeCardStep";
import LandingStep from "./LandingStep";
import SelectDisputeReasonStep from "./SelectDisputeReasonStep";

type Steps = "landing" | "freeze-card" | "reasons" | "create-dispute";

export default function PaymentDisputeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "PaymentDisputes.PaymentDisputeScreen">>();

  // TODO: get cardId
  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;
  const transactionDetails = route.params.transactionDetails;

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
  const [isGenericErrorVisible, setIsGenericErrorVisible] = useState(false);

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
    if (!card.isFetching && card.isSuccess && selectedCard === undefined) {
      setIsGenericErrorVisible(true);
    } else {
      if (!isCardFrozen) {
        handleOnNextStep("freeze-card");
      } else {
        handleOnNextStep("create-dispute");
      }
    }
  };

  const handleOnSelectReason = (code: string) => {
    handleOnNextStep("create-dispute");
    setReasonCode(code);
  };

  const handleOnCreateDisputeBack = () => {
    handleOnNextStep(previousStep === "reasons" ? "reasons" : "landing");
  };

  const handleOnCardIsFrozen = (value: boolean) => {
    setIsCardFrozen(value);
  };

  const handleOnCloseGenericError = () => {
    setIsGenericErrorVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        {selectedCard && cardType && cardStatus !== undefined ? (
          currentStep === "landing" ? (
            <LandingStep
              onProblemWithTransactionLink={handleOnProblemWithTransactionLink}
              onFraudLink={handleOnFraudLink}
              onClose={() => navigation.goBack()}
            />
          ) : currentStep === "freeze-card" ? (
            <FreezeCardStep
              onClose={() => handleOnNextStep("landing")}
              onContinue={() => handleOnNextStep("create-dispute")}
              onCardIsFrozen={handleOnCardIsFrozen}
              cardId={cardId}
            />
          ) : currentStep === "reasons" ? (
            <SelectDisputeReasonStep
              cardId={cardId}
              createDisputeUserId={createDisputeUserId}
              transactionDetails={transactionDetails}
              transactionType={transactionType}
              onBack={() => handleOnNextStep("landing")}
              onSelectReason={handleOnSelectReason}
            />
          ) : (
            <CreateDisputeStep
              caseType={caseType}
              cardId={cardId}
              cardType={cardType}
              cardStatus={cardStatus}
              reasonCode={reasonCode}
              transactionType={transactionType}
              createDisputeUserId={createDisputeUserId}
              isCardFrozen={isCardFrozen}
              transactionDetails={transactionDetails}
              onBack={handleOnCreateDisputeBack}
            />
          )
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
      <NotificationModal
        variant="error"
        isVisible={isGenericErrorVisible}
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        buttons={{
          primary: <Button onPress={handleOnCloseGenericError}>{t("errors.generic.button")}</Button>,
        }}
      />
    </SafeAreaProvider>
  );
}
