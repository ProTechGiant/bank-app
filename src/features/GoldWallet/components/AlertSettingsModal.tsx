import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AngleDownIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { UnstyledCurrencyInput } from "@/components/Input";
import NotificationModal from "@/components/NotificationModal";
import Toggle from "@/components/Toggle";
import { useThemeStyles } from "@/theme";

import { useSetAlertSettings } from "../hooks/query-hooks";
import { AlertConditionsEnum, AlertSettingsResponseType, AlertStatus, ConditionWithLabelsType } from "../types";
import ConditionsModal from "./ConditionsModal";

interface AlertSettingsModalProps {
  isVisible: boolean;
  onChangeVisibility: (status: boolean) => void;
  currentAlertSettings: AlertSettingsResponseType;
  conditionsWithLabels: ConditionWithLabelsType[];
}
export default function AlertSettingsModal({
  isVisible,
  onChangeVisibility,
  currentAlertSettings,
  conditionsWithLabels,
}: AlertSettingsModalProps) {
  const { t } = useTranslation();

  const {
    ActiveFlag: isAlertActive,
    Operator: initialCondition,
    TargetPrice: initialPriceValue,
  } = currentAlertSettings;

  const { isLoading, mutateAsync: setAlertSettings } = useSetAlertSettings();

  const [isToggleOn, setIsToggleOn] = useState<boolean>(isAlertActive === AlertStatus.ACTIVE);
  const [priceValue, setPriceValue] = useState<number>(initialPriceValue);
  const [conditionValue, setConditionValue] = useState<AlertConditionsEnum>(initialCondition);
  const [isConditionsModalVisible, setIsConditionsModalVisible] = useState<boolean>(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);
  const [notificationModalVariant, setNotificationModalVariant] = useState<"error" | "success">("success");

  const handleOnDropDownPress = () => {
    if (isToggleOn) setIsConditionsModalVisible(true);
  };

  const handleOnSubmitSettings = async () => {
    try {
      await setAlertSettings({
        ActiveFlag: isToggleOn ? AlertStatus.ACTIVE : AlertStatus.INACTIVE,
        TargetPrice: priceValue,
        Operator: conditionValue,
      });
      setNotificationModalVariant("success");
    } catch (err) {
      setNotificationModalVariant("error");
    } finally {
      setIsNotificationModalVisible(true);
    }
  };

  const toggleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: theme.spacing["12p"],
  }));

  const inputStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    padding: theme.spacing["16p"],
    borderRadius: theme.spacing["8p"],
  }));

  const currencyContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      position: "absolute",
      left: priceValue.toString().length * 10 + theme.spacing["16p"],
      justifyContent: "center",
      top: 0,
      bottom: 0,
    }),
    [priceValue]
  );

  return (
    <Modal onBack={() => onChangeVisibility(false)} visible={isVisible} headerText="" style={styles.modalStyle}>
      <SafeAreaView style={styles.safeAreaView}>
        <Stack direction="vertical" gap="12p">
          <Typography.Header weight="medium">{t("GoldWallet.AlertSettingsModal.title")}</Typography.Header>
          <Typography.Text color="neutralBase+10">{t("GoldWallet.AlertSettingsModal.subtitle")}</Typography.Text>
          <Stack direction="horizontal" style={toggleContainerStyle}>
            <Typography.Text weight="medium">{t("GoldWallet.AlertSettingsModal.toggle")}</Typography.Text>
            <Toggle onPress={() => setIsToggleOn(status => !status)} value={isToggleOn} />
          </Stack>
          <Stack direction="vertical" style={styles.inputContainer} gap="8p">
            <Typography.Text weight="medium">{t("GoldWallet.AlertSettingsModal.operation")}</Typography.Text>

            <Pressable style={inputStyle} onPress={handleOnDropDownPress}>
              <Typography.Text color="neutralBase">
                {conditionsWithLabels.find(condition => condition.value === conditionValue)?.label}
              </Typography.Text>
              <AngleDownIcon />
            </Pressable>

            <Stack direction="vertical" style={styles.inputContainer} gap="8p">
              <Typography.Text weight="medium">{t("GoldWallet.AlertSettingsModal.price")}</Typography.Text>
              <Stack direction="vertical" style={styles.inputContainer}>
                <UnstyledCurrencyInput
                  editable={isToggleOn}
                  style={inputStyle}
                  value={priceValue}
                  maxLength={15}
                  onChange={value => setPriceValue(value)}
                />
                <View style={currencyContainerStyle}>
                  <Typography.Text color="neutralBase+10">
                    {t("GoldWallet.AlertSettingsModal.currency")}
                  </Typography.Text>
                </View>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Button onPress={handleOnSubmitSettings} loading={isLoading}>
          {t("GoldWallet.AlertSettingsModal.done")}
        </Button>
      </SafeAreaView>
      <ConditionsModal
        isVisible={isConditionsModalVisible}
        onChangeVisibility={setIsConditionsModalVisible}
        currentValue={conditionValue}
        setValue={setConditionValue}
        values={conditionsWithLabels}
      />
      <NotificationModal
        variant={notificationModalVariant}
        isVisible={isNotificationModalVisible}
        onClose={() => setIsNotificationModalVisible(false)}
        title={
          notificationModalVariant === "success"
            ? t("GoldWallet.AlertSettingsModal.NotificationModal.successTitle")
            : t("GoldWallet.AlertSettingsModal.NotificationModal.errorTitle")
        }
        message={
          notificationModalVariant === "success"
            ? `${t("GoldWallet.AlertSettingsModal.NotificationModal.successMessage")} ${priceValue} SAR`
            : t("GoldWallet.AlertSettingsModal.NotificationModal.errorMessage")
        }
        buttons={
          notificationModalVariant === "success"
            ? {
                primary: (
                  <Button onPress={() => onChangeVisibility(false)}>
                    {t("GoldWallet.AlertSettingsModal.NotificationModal.successButton")}
                  </Button>
                ),
              }
            : undefined
        }
      />
    </Modal>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  modalStyle: {
    height: "90%",
  },
  safeAreaView: {
    height: "90%",
    justifyContent: "space-between",
  },
});
