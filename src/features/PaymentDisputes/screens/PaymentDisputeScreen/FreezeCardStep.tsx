import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { FreezeIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useFreezeCard } from "@/features/CardActions/hooks/query-hooks";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

interface FreezeCardStepProps {
  onClose: () => void;
  onContinue: () => void;
  isSuccess: boolean;
  onCardIsFrozen: (value: boolean) => void;
  cardId: string;
}

export default function FreezeCardStep({
  onClose,
  onContinue,
  isSuccess,
  onCardIsFrozen,
  cardId,
}: FreezeCardStepProps) {
  const { t } = useTranslation();

  const freezeCardAsync = useFreezeCard();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isFrozenCardModalVisible, setIsFrozenCardModalVisible] = useState(false);

  const handleOnFreezeCardPress = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });

      if (response.Status !== "freeze") {
        throw new Error("Received unexpected response from backend");
      }

      onCardIsFrozen(true);
      setIsFrozenCardModalVisible(true);
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnPressCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  const handleOnPressExit = () => {
    onClose();
  };

  const handleOnPressFreezeContinue = () => {
    setIsFrozenCardModalVisible(false);
    onContinue();
  };

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <>
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnPressExit} />} />
      {isSuccess ? (
        <ContentContainer>
          <Stack direction="vertical" gap="8p" style={styles.contentStyle}>
            <Typography.Text size="title1" weight="medium">
              {t("PaymentDisputes.FreezeCardModal.title")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase+10">
              {t("PaymentDisputes.FreezeCardModal.subtitle")}
            </Typography.Text>
          </Stack>

          <Stack direction="vertical" align="stretch">
            <Button onPress={handleOnFreezeCardPress} loading={freezeCardAsync.isLoading}>
              {t("PaymentDisputes.FreezeCardModal.freezeButton")}
            </Button>
            <Button variant="tertiary" onPress={onContinue}>
              {t("PaymentDisputes.FreezeCardModal.noFreezeButton")}
            </Button>
          </Stack>
        </ContentContainer>
      ) : (
        <FlexActivityIndicator />
      )}
      <NotificationModal
        variant="confirmations"
        icon={<FreezeIcon color={iconColor} />}
        buttons={{
          primary: (
            <Button onPress={handleOnPressFreezeContinue}>
              {t("PaymentDisputes.FreezeCardModal.freezeModal.button")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.FreezeCardModal.freezeModal.message")}
        title={t("PaymentDisputes.FreezeCardModal.freezeModal.title")}
        isVisible={isFrozenCardModalVisible}
      />
      <NotificationModal
        variant="error"
        buttons={{
          primary: (
            <Button onPress={handleOnPressCloseErrorModal}>
              {t("PaymentDisputes.FreezeCardModal.errorModal.button")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.FreezeCardModal.errorModal.message")}
        title={t("PaymentDisputes.FreezeCardModal.errorModal.title")}
        isVisible={isErrorModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
  },
});
