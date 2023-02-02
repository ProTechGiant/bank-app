import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { FieldValues, Path, PathValue, useController } from "react-hook-form";
import { Dimensions, I18nManager, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { CheckmarkCircle, ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
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
}: DropdownInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<typeof field["value"]>();

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

      const defaultValue = options[0].value;
      setSelectedValue(defaultValue);
      setImmediate(() => field.onChange(defaultValue));
    }
  }, [isEditable, placeholder, options]);

  const handleOnChange = (value: string) => {
    field.onChange(value ?? options[0]?.value);
  };

  const handleOnOpen = () => {
    if (!isEditable) return;

    if (field.value === undefined && options.length > 0) setSelectedValue(options[0].value);
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

  const renderCheckMark = (option: { label: string; value: PathValue<T, Path<T>>; disabled?: boolean }) => {
    if (selectedValue === option.value || option.disabled === true) return <CheckmarkCircle />;
  };

  const modalContainer = useThemeStyles<ViewStyle>(
    () => ({
      height: Dimensions.get("window").height - 164,
    }),
    []
  );
  const optionContainer = useThemeStyles<ViewStyle>(
    ({ spacing, palette }) => ({
      paddingVertical: spacing.medium,
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: palette["neutralBase-20"],
    }),
    []
  );

  const checkBoxStyles = useThemeStyles<ViewStyle>(
    ({ palette }) => ({
      borderColor: palette["neutralBase-20"],
      height: 24,
      width: 24,
      borderWidth: 2,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <>
      {!fullHeight ? (
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
      ) : (
        <>
          <Modal onClose={handleOnClose} headerText={headerText ?? label} visible={isVisible}>
            <ScrollView style={modalContainer}>
              {options.map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => !option.disabled && handleOnModalChange(option.value)}
                  style={[optionContainer, option.disabled && { opacity: 0.4 }]}>
                  <View style={styles.textContainer}>
                    <Typography.Text color="tintBase+30" size="callout" weight="regular">
                      {option.label}
                    </Typography.Text>
                  </View>
                  <View style={checkBoxStyles}>{renderCheckMark(option)}</View>
                  <View />
                </Pressable>
              ))}
            </ScrollView>
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
              <Button onPress={handleOnConfirm}>Confirm</Button>
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
  textContainer: {
    flex: 1,
  },
});
