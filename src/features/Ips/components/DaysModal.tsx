import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal, Typography } from "@/components";
import Button from "@/components/Button";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";

import { DAYS_BEFORE_EXPIRY } from "../constants";
import { DaysType } from "../type";

interface DaysModalProps {
  isVisible: boolean;
  onClose: () => void;
  setValue: (value: DaysType) => void;
  selectedValue: DaysType | undefined;
}
export default function DaysModal({ isVisible, onClose, setValue, selectedValue }: DaysModalProps) {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState<DaysType | undefined>(selectedValue);
  const isSelectButtonDisabled = currentValue === selectedValue;

  const handleOnSelectPress = () => {
    if (!isSelectButtonDisabled && currentValue !== undefined) {
      setValue(currentValue);
      onClose();
    }
  };
  return (
    <Modal onClose={onClose} visible={isVisible} headerText="Request days">
      <RadioButtonGroup onPress={setCurrentValue} value={currentValue}>
        {DAYS_BEFORE_EXPIRY.map(day => (
          <RadioButton
            label={t(`Ips.RequestDetailsScreen.days.${day}`)}
            value={day}
            isSelected={currentValue === day}
            key={day}
          />
        ))}
      </RadioButtonGroup>
      <Button onPress={handleOnSelectPress} disabled={isSelectButtonDisabled}>
        <Typography.Text color={isSelectButtonDisabled ? "neutralBase+30" : "neutralBase-60"}>
          {t(`Ips.RequestDetailsScreen.days.selectDay`)}
        </Typography.Text>
      </Button>
    </Modal>
  );
}
