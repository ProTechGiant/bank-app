import { useEffect, useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { I18nManager, Pressable, ScrollView, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
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
  }, [isEditable, placeholder, options, fullHeight, field, autoselect]);

  const handleOnChange = (value: string) => {
    field.onChange(value ?? options[0]?.value);
    setSelectedValue(field.value);
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
    ({ spacing }) => ({
      paddingHorizontal: spacing["20p"],
      paddingVertical: spacing["16p"],
      width: "100%",
    }),
    []
  );

  const optionStyle = useThemeStyles<ViewStyle>(({ spacing, radii }) => ({
    padding: spacing["20p"],
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: radii.small,
  }));

  const selectedOptionStyle = useThemeStyles<ViewStyle>(({ palette }) => ({
    backgroundColor: palette["neutralBase-30"],
  }));

  const optionsContainer = useThemeStyles<ViewStyle>(({ spacing }) => ({
    marginVertical: spacing["24p"],
    height: 250,
  }));

  return (
    <>
      <Modal onClose={handleOnClose} headerText={headerText ?? label} visible={isVisible}>
        {!fullHeight ? (
          <ScrollView style={optionsContainer}>
            {options.map(option => (
              <Pressable
                key={option.value}
                onPress={() => handleOnChange(option.value)}
                disabled={option.disabled}
                style={[optionStyle, selectedValue === option.value && selectedOptionStyle]}>
                <Typography.Text color="neutralBase+30" size="body" weight="regular">
                  {option.label}
                </Typography.Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <DropdownInputList options={options} onChange={handleOnModalChange} value={selectedValue} />
        )}
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
