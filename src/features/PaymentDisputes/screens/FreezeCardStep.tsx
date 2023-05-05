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
import { useThemeStyles } from "@/theme";

interface FreezeCardStepProps {
  onClose: () => void;
  onContinue: () => void;
  onFreezeCardPress: () => void;
  isSuccess: boolean;
  isError: boolean;
  onPressCloseErrorModal: () => void;
}

export default function FreezeCardStep({
  onClose,
  onContinue,
  onFreezeCardPress,
  isSuccess,
  isError,
  onPressCloseErrorModal,
}: FreezeCardStepProps) {
  const { t } = useTranslation();

  const [isFrozenCardModalVisible, setIsFrozenCardModalVisible] = useState(false);

  const handleOnPressExit = () => {
    onClose();
  };

  const handleOnPressContinue = () => {
    setIsFrozenCardModalVisible(false);
    onContinue();
  };

  const handleOnPressFreezeCard = () => {
    onFreezeCardPress();
    setIsFrozenCardModalVisible(true);
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
            <Button onPress={handleOnPressFreezeCard}>{t("PaymentDisputes.FreezeCardModal.freezeButton")}</Button>
            <Button variant="tertiary" onPress={handleOnPressContinue}>
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
            <Button onPress={handleOnPressContinue}>{t("PaymentDisputes.FreezeCardModal.freezeModal.button")}</Button>
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
            <Button onPress={onPressCloseErrorModal}>{t("PaymentDisputes.FreezeCardModal.errorModal.button")}</Button>
          ),
        }}
        message={t("PaymentDisputes.FreezeCardModal.errorModal.message")}
        title={t("PaymentDisputes.FreezeCardModal.errorModal.title")}
        isVisible={isError}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
  },
});
