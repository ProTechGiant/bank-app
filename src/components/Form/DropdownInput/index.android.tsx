import { Picker } from "@react-native-picker/picker";
import { FieldProps } from "formik";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";

interface DropdownProps extends FieldProps<string> {
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  placeholder?: string;
  label?: string;
  options: Array<{ label: string; value: string }>;
}

export default function DropdownInput({
  extra,
  isEditable = true,
  label,
  field,
  meta,
  placeholder,
  options = [],
}: DropdownProps) {
  useEffect(() => {
    const isSelectedValueLegal = options.find(o => o.value === field.value);
    if (!isEditable || undefined !== placeholder || options.length < 1 || ("" !== field.value && isSelectedValueLegal))
      return;

    const defaultValue = options[0].value;
    setImmediate(() => field.onChange({ target: { name: field.name, value: defaultValue } }));
  }, [isEditable, placeholder, options]);

  const handleOnChange = (value: string) => {
    field.onChange({ target: { name: field.name, value: value ?? options[0]?.value } });
  };

  return (
    <View>
      <InputBox extraStart={extra} isEditable={isEditable} label={label} meta={meta}>
        <InputText
          buttonIcon={<ChevronRightIcon />}
          placeholder={placeholder}
          value={options.find(opt => opt.value === field.value)?.label}
        />
      </InputBox>
      <Picker
        enabled={isEditable}
        mode="dropdown"
        prompt={label}
        onValueChange={handleOnChange}
        itemStyle={styles.item}
        style={styles.picker}
        selectedValue={field.value}>
        {options.map(option => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    color: "black",
  },
  picker: {
    backgroundColor: "transparent",
    height: "100%",
    opacity: 0,
    position: "absolute",
    width: "100%",
  },
});
