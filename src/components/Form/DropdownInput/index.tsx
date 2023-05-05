import { useState } from "react";
import { FieldValues, Path, PathValue, useController } from "react-hook-form";
import { I18nManager, View } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import DropdownInputBase from "@/components/DropdownInput";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
import DropdownInputProps from "./DropdownInputProps";

export default function DropdownInput<T extends FieldValues>({
  control,
  extra,
  isEditable = true,
  isFixedHeight = false,
  headerText,
  label,
  name,
  placeholder,
  options = [],
  buttonLabel,
  autoselect = true,
}: DropdownInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);

  const handleOnOpen = () => {
    if (!isEditable) return;

    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
    field.onBlur();
  };

  const handleOnChange = (value: PathValue<T, Path<T>> | undefined) => {
    setIsVisible(false);

    field.onBlur();
    field.onChange(value);
  };

  return (
    <>
      <DropdownInputBase
        autoselect={autoselect}
        buttonLabel={buttonLabel}
        onChange={handleOnChange}
        onClose={handleOnClose}
        options={options}
        headerText={headerText ?? label ?? ""}
        isFixedHeight={isFixedHeight}
        isVisible={isVisible}
        value={field.value}
      />
      <InputBox
        extraStart={extra}
        isEditable={isEditable}
        label={label}
        isTouched={fieldState.isTouched}
        error={fieldState.error}
        onPress={handleOnOpen}
        bordered={false}>
        <InputText
          buttonIcon={
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <AngleDownIcon />
            </View>
          }
          placeholder={placeholder}
          value={options.find(opt => opt.value === field.value)?.label}
        />
      </InputBox>
    </>
  );
}
