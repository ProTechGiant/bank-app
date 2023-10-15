import { useTranslation } from "react-i18next";

import { Modal } from "@/components";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";

import { AlertConditionsEnum, ConditionWithLabelsType } from "../types";

interface ConditionsModalProps {
  isVisible: boolean;
  onChangeVisibility: (status: boolean) => void;
  currentValue: AlertConditionsEnum;
  setValue: (value: AlertConditionsEnum) => void;
  values: ConditionWithLabelsType[];
}
export default function ConditionsModal({
  isVisible,
  onChangeVisibility,
  currentValue,
  setValue,
  values,
}: ConditionsModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      visible={isVisible}
      onClose={() => onChangeVisibility(false)}
      headerText={t("GoldWallet.AlertSettingsModal.ConditionsModal.title")}>
      <RadioButtonGroup value={currentValue} onPress={value => setValue(value)}>
        {values.map(value => (
          <RadioButton label={value.label} value={value.value} key={value.label} />
        ))}
      </RadioButtonGroup>
    </Modal>
  );
}
