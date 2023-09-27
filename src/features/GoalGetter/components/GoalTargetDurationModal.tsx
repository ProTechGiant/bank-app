import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";

type DurationOption = {
  id: number;
  value: number;
  label: string;
};

interface GoalDurationModalProps {
  isVisible: boolean;
  onSubmit: (nextValue: DurationOption | null) => void;
  onClose: () => void;
  onCustomDatePress: () => void;
  options: DurationOption[];
}

export default function GoalTargetDurationModal({
  isVisible,
  onSubmit,
  onClose,
  options,
  onCustomDatePress,
}: GoalDurationModalProps) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<DurationOption | null>(null);

  const handleOnRadioButtonPress = (newValue: number) => {
    const currentOption = options.find(option => option.id === newValue)!;
    setSelectedOption(currentOption);
  };

  const handleOnSelectButtonPress = () => {
    if (selectedOption?.id === 0) {
      onCustomDatePress();
    } else {
      onSubmit(selectedOption);
    }
  };

  return (
    <Modal visible={isVisible} onClose={onClose} headerText={t("GoalGetter.targetAmountScreen.title")}>
      <RadioButtonGroup value={selectedOption?.id} onPress={newValue => handleOnRadioButtonPress(newValue)}>
        {options.map(option => (
          <RadioButton value={option.id} label={option.label} key={option.id} />
        ))}
      </RadioButtonGroup>
      <Button onPress={handleOnSelectButtonPress} disabled={!selectedOption}>
        {t("GoalGetter.targetAmountScreen.select")}
      </Button>
    </Modal>
  );
}
