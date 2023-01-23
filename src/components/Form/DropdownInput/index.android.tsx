import { Picker } from "@react-native-picker/picker";
import { useEffect } from "react";
import { FieldValues, useController } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
import DropdownInputProps from "./DropdownInputProps";

export default function DropdownInput<T extends FieldValues>({
  control,
  extra,
  isEditable = true,
  label,
  name,
  placeholder,
  options = [],
}: DropdownInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  useEffect(() => {
    const isSelectedValueLegal = options.find(o => o.value === field.value);
    if (
      !isEditable ||
      undefined !== placeholder ||
      options.length < 1 ||
      (undefined !== field.value && isSelectedValueLegal)
    )
      return;

    setImmediate(() => field.onChange(options[0].value));
  }, [isEditable, placeholder, options]);

  const handleOnChange = (value: string) => {
    field.onChange(value ?? options[0]?.value);
  };

  return (
    <View>
      <InputBox extraStart={extra} isEditable={isEditable} label={label} fieldState={fieldState}>
        <InputText
          buttonIcon={<ChevronRightIcon />}
          placeholder={placeholder}
          value={options.find(opt => opt.value === field.value)?.label}
        />
      </InputBox>
      <Picker
        onBlur={() => {
          field.onBlur();
        }}
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
