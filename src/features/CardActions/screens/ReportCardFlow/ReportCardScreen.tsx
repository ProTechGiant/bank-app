import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";

import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import usePrimaryAddress from "@/hooks/use-primary-address";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useFreezeCard } from "../../hooks/query-hooks";
import ConfirmDeliveryAddress from "./ConfirmDeliveryAddress";
import SelectReportReason from "./SelectReportReason";

export default function ReportCardScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.ReportCardScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  const cardId = route.params.cardId;
  const primaryAddress = usePrimaryAddress();
  const freezeCardAsync = useFreezeCard();

  const [mode, setMode] = useState<"input" | "address">("input");
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<string>();

  const currentStep = mode === "input" ? 1 : 2;
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: dimensions.width * (currentStep - 1) });
  }, [currentStep, mode]);

  const handleOnSelectReasonPress = (selectedReason: string | undefined) => {
    if (primaryAddress.isError || primaryAddress === undefined) {
      setIsErrorModalVisible(true);
    } else {
      setReportReason(selectedReason);
      setMode("address");
    }
  };

  const handleOnFreezePress = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });

      if (response.Status !== "freeze") {
        throw new Error("Received unexpected response from back-end");
      } else {
        navigation.goBack();
      }
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleBack = () => {
    if (mode === "address") {
      setMode("input");
      return;
    }

    navigation.goBack();
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("CardActions.ReportCardScreen.navTitle")} onBackPress={handleBack}>
          <ProgressIndicator currentStep={currentStep} totalStep={2} />
        </NavHeader>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}>
          <View style={{ width: dimensions.width }}>
            <SelectReportReason
              isLoading={primaryAddress.isLoading}
              onContinuePress={handleOnSelectReasonPress}
              onFreezePress={handleOnFreezePress}
            />
          </View>
          <View style={{ width: dimensions.width }}>
            <ConfirmDeliveryAddress primaryAddress={primaryAddress.data} reason={reportReason} cardId={cardId} />
          </View>
        </ScrollView>
      </Page>
      <NotificationModal
        variant="error"
        title={
          primaryAddress.isError
            ? t("CardActions.ReportCardScreen.SelectReportReason.addressErrorTitle")
            : t("errors.generic.title")
        }
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </>
  );
}
