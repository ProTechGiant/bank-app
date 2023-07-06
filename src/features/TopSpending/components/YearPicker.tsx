import { Picker } from "@react-native-picker/picker";
import { getYear } from "date-fns";

const currentYear = getYear(new Date());
const yearOptions = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

interface YearPickerProps {
  selectedYear: number;
  onChangeYear: (value: number) => void;
}

export default function YearPicker({ selectedYear, onChangeYear }: YearPickerProps) {
  return (
    <Picker selectedValue={selectedYear} onValueChange={itemValue => onChangeYear(itemValue)}>
      {yearOptions.map((item, index: number) => (
        <Picker.Item label={item} value={item} key={index} />
      ))}
    </Picker>
  );
}
