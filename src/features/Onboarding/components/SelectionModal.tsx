import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, ViewStyle } from "react-native";

import { Modal, Stack } from "@/components";
import Button from "@/components/Button";
import { TextInput } from "@/components/Input";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { ListItemType } from "../types";

interface SelectionModalProps {
  listItems: ListItemType[];
  header: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  isVisible: boolean;
  preSelectedValue: string;
}

export default function SelectionModal({
  listItems,
  header,
  isVisible,
  onClose,
  onSelect,
  preSelectedValue,
}: SelectionModalProps) {
  const { height: screenHeight } = useWindowDimensions();
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setSelectedValue(preSelectedValue);
  }, [preSelectedValue]);

  const isTextAreaVisible = useMemo(() => {
    const [selectedItem] = listItems.filter(e => e.value === selectedValue);
    return selectedItem?.label === "others";
  }, [selectedValue]);

  const handleOnSelect = () => {
    if (isTextAreaVisible) {
      onSelect(inputValue);
    }
    onSelect(selectedValue);
  };

  const bottomMargin = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const radioButtonsContainerStyle: ViewStyle = {
    maxHeight: screenHeight * 0.6,
  };

  return (
    <Modal visible={isVisible} onClose={onClose} headerText={header}>
      <ScrollView showsVerticalScrollIndicator={false} style={radioButtonsContainerStyle}>
        <RadioButtonGroup onPress={e => setSelectedValue(e ?? "")} value={selectedValue}>
          {listItems.map(listItem => {
            return (
              <RadioButton
                label={t(`Onboarding.FinancialInfoSelectionModal.${listItem.label}`)}
                value={listItem.value}
              />
            );
          })}
        </RadioButtonGroup>
      </ScrollView>

      {isTextAreaVisible ? (
        <Stack direction="vertical" align="stretch" style={bottomMargin}>
          <TextInput
            value={inputValue}
            onClear={() => setInputValue("")}
            numberOfLines={3}
            multiline={true}
            maxLength={50}
            onChangeText={setInputValue}
            label={t("Onboarding.IncomeDetailsScreen.inputMainTypeIncomeHere")}
            showCharacterCount={true}
            extraStart={t("Onboarding.IncomeDetailsScreen.minimum5Characters")}
          />
        </Stack>
      ) : null}

      <Button disabled={isTextAreaVisible ? inputValue.length < 5 : false} onPress={handleOnSelect}>
        {t("Onboarding.OccupationalInfoScreen.set")}
      </Button>
    </Modal>
  );
}
