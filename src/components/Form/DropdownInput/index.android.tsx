import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useThemeStyles } from "@/theme";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
import { DropdownInputList } from "./DropdownInputList";
import DropdownInputProps from "./DropdownInputProps";

export default function DropdownInput<T extends FieldValues>({
  control,
  fullHeight = false,
  extra,
  isEditable = true,
  label,
  name,
  headerText,
  placeholder,
  options = [],
  buttonLabel,
  autoselect = true,
}: DropdownInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<(typeof field)["value"]>();

  useEffect(() => {
    setSelectedValue(field.value);
  }, [field.value]);

  useEffect(() => {
    if (!fullHeight) {
      const isSelectedValueLegal = options.find(o => o.value === field.value);
      if (
        !isEditable ||
        undefined !== placeholder ||
        options.length < 1 ||
        (undefined !== field.value && isSelectedValueLegal)
      )
        return;

      setImmediate(() => field.onChange(options[0].value));
    } else {
      if (!isEditable || undefined !== placeholder || options.length < 1 || undefined !== field.value) return;

      if (autoselect) {
        const defaultValue = options[0].value;
        setSelectedValue(defaultValue);
        setImmediate(() => field.onChange(defaultValue));
      }
    }
  }, [isEditable, placeholder, options]);

  const handleOnChange = (value: string) => {
    field.onChange(value ?? options[0]?.value);
  };

  const handleOnOpen = () => {
    if (!isEditable) return;

    if (autoselect && field.value === undefined && options.length > 0) setSelectedValue(options[0].value);
    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
    setSelectedValue(field.value);

    field.onBlur();
  };

  const handleOnModalChange = (value: typeof selectedValue) => {
    setSelectedValue(value ?? options[0]?.value);
  };

  const handleOnConfirm = () => {
    setIsVisible(false);

    field.onBlur();
    field.onChange(selectedValue);
  };

  const buttonContainer = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      paddingHorizontal: theme.spacing["20p"],
      paddingVertical: theme.spacing["16p"],
      width: "100%",
    }),
    []
  );

  return (
    <>
      {!fullHeight ? (
        <View>
          <InputBox
            extraStart={extra}
            isEditable={isEditable}
            label={label}
            isTouched={fieldState.isTouched}
            error={fieldState.error}>
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
      ) : (
        <>
          <Modal onClose={handleOnClose} headerText={headerText ?? label} visible={isVisible}>
            <DropdownInputList options={options} onChange={handleOnModalChange} value={selectedValue} />
            <View style={buttonContainer}>
              <Button onPress={handleOnConfirm} disabled={selectedValue === undefined}>
                {buttonLabel}
              </Button>
            </View>
          </Modal>
          <InputBox
            extraStart={extra}
            isEditable={isEditable}
            label={label}
            fieldState={fieldState}
            onPress={handleOnOpen}>
            <InputText
              buttonIcon={
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ChevronRightIcon />
                </View>
              }
              placeholder={placeholder}
              value={options.find(opt => opt.value === field.value)?.label}
            />
          </InputBox>
        </>
      )}
    </>
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
