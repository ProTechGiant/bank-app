import { format, subMonths } from "date-fns";
import React from "react";
import { View, ViewStyle } from "react-native";

import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import LabeledCheckbox from "./LabeledCheckbox";
interface DateSelectorForStandardTierProps {
  isCompareModal: boolean;
  handleOnSelectCheckBox: (month: string) => void;
  comparisonDateState: string[];
  setTransactionDateState: (month: string) => void;
  transactionDateState: string;
}

export default function DateSelectorForStandardTier({
  isCompareModal,
  comparisonDateState,
  handleOnSelectCheckBox,
  transactionDateState,
  setTransactionDateState,
}: DateSelectorForStandardTierProps) {
  const currentDate = new Date();
  const currentMonthName = format(currentDate, "MMMM");
  const previousMonthName = format(subMonths(currentDate, 1), "MMMM");
  const twoMonthsAgoName = format(subMonths(currentDate, 2), "MMMM");

  const radioButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <React.Fragment>
      <View style={radioButtonContainerStyle}>
        {isCompareModal ? (
          <Stack align="stretch" gap="8p" direction="vertical">
            <LabeledCheckbox
              label={currentMonthName}
              isSelect={comparisonDateState.includes(currentMonthName)}
              onSelect={() => handleOnSelectCheckBox(currentMonthName)}
            />
            <LabeledCheckbox
              label={previousMonthName}
              isSelect={comparisonDateState.includes(previousMonthName)}
              onSelect={() => handleOnSelectCheckBox(previousMonthName)}
            />
            <LabeledCheckbox
              label={twoMonthsAgoName}
              isSelect={comparisonDateState.includes(twoMonthsAgoName)}
              onSelect={() => handleOnSelectCheckBox(twoMonthsAgoName)}
            />
          </Stack>
        ) : (
          <RadioButtonGroup onPress={value => setTransactionDateState(value)} value={transactionDateState}>
            <RadioButton label={currentMonthName} value={currentMonthName} />
            <RadioButton label={previousMonthName} value={previousMonthName} />
            <RadioButton label={twoMonthsAgoName} value={twoMonthsAgoName} />
          </RadioButtonGroup>
        )}
      </View>
    </React.Fragment>
  );
}
