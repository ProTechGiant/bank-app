import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import DayPicker from "@/components/DayPicker";
import { useThemeStyles } from "@/theme";

import Button from "../Button";

export interface DayPickerInputProps {
  buttonText: string;
  onBlur?: () => void;
  onChange?: (value: number) => void;
  headerText: string;
  testID?: string;
  value?: number;
  disabled?: boolean;
  helperText?: (value: any) => string | undefined;
  label?: string;
  placeholder?: string;
}

export function DayPickerInput({
  buttonText,
  onBlur,
  onChange,
  headerText,
  testID,
  value,
  disabled,
}: DayPickerInputProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ?? 1);
  const [selectedDayText, setSelectedDayText] = useState<string | null>(null);

  const handleOnConfirm = () => {
    setIsVisible(false);
    setSelectedDayText(
      t("GoalGetter.ContributionsScreen.contributionButton", {
        day: formatDayWithOrdinal(selectedValue),
      })
    );
    onChange?.(selectedValue);
    onBlur?.();
  };

  const handleOnChange = (nextSelectedValue: number) => {
    setSelectedValue(nextSelectedValue);
  };

  const formatDayWithOrdinal = (day: number): string => {
    const date = new Date(2023, 0, day); // 2023 and January (0) are arbitrary and don't affect the outcome

    const formattedDay = format(date, "do");
    return formattedDay;
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    onBlur?.();
  };
  const secondaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <>
      <View style={secondaryButtonStyle}>
        <Button
          onPress={() => setIsVisible(true)}
          variant="secondary"
          size="small"
          iconRight={<AngleDownIcon />}
          disabled={disabled}>
          {selectedDayText || t("GoalGetter.ContributionsScreen.buttonContent")}
        </Button>
      </View>

      <DayPicker
        buttonText={buttonText}
        headerText={headerText}
        onChange={handleOnChange}
        isVisible={isVisible}
        onClose={handleOnCancel}
        onConfirm={handleOnConfirm}
        testID={testID !== undefined ? `${testID}-DayPicker` : undefined}
        value={selectedValue}
      />
    </>
  );
}
