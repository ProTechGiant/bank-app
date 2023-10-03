import { ScrollView } from "react-native";

import { RadioButtonGroup } from "@/components/RadioButton";

import { PredefinedOption } from "../types";
import PredefinedOptionCard from "./PredefinedOptionCard";
interface PredefinedOptionsListProps {
  predefinedOptionList: PredefinedOption[];
  onSelectPredefindOption: (value: number) => void;
  predefinedValue: number;
}

export default function PredefinedOptionsList({
  predefinedOptionList,
  onSelectPredefindOption,
  predefinedValue,
}: PredefinedOptionsListProps) {
  return (
    <ScrollView>
      <RadioButtonGroup onPress={value => onSelectPredefindOption(value)} value={predefinedValue}>
        {predefinedOptionList?.length === 0 ? (
          predefinedOptionList.map(predefinedElement => {
            return (
              <PredefinedOptionCard
                key={predefinedElement.Id}
                predefinedOption={predefinedElement}
                value={predefinedElement.Id}
                isSelected={predefinedElement.Id === predefinedValue}
              />
            );
          })
        ) : (
          <></>
        )}
      </RadioButtonGroup>
    </ScrollView>
  );
}
