import { useField } from "formik";
import { useState } from "react";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { DownArrowIcon, UpArrowIcon } from "@/assets/icons";
import Dropdown from "@/components/Dropdown";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import SelectOption from "./SelectOption";

export type Option = {
  label: string;
  value: string;
};

interface SelectInputProps {
  name: string;
  title: string;
  helperText?: string;
  label: string;
  data: Option[];
  isOptional?: boolean;
}

const SelectInput = ({ name, title, helperText, label, data, isOptional = false }: SelectInputProps) => {
  const selectContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.medium,
    }),
    []
  );
  const selectStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.palette["neutralBase-50"],
      padding: theme.spacing.medium,
      borderColor: theme.palette["neutralBase-20"],
      borderWidth: 1,
      borderRadius: theme.radii.extraSmall,
    }),
    []
  );
  const isActiveStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette.complimentBase,
      borderWidth: 2,
    }),
    []
  );
  const optionListStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingLeft: theme.spacing.medium,
      maxHeight: 174,
    }),
    []
  );
  const toggleIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: theme.iconDimensions.accordian,
      width: theme.iconDimensions.accordian,
      justifyContent: "center",
      alignItems: "flex-end",
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.dropdown, []);

  const [field, , helper] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(field.value);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const SelectionHandler = (value: string) => {
    setSelected(value);
    helper.setValue(value);
    toggleSelect();
  };

  const renderSelected = () => {
    if (selected) {
      return (
        <Typography.Text size="callout" color="neutralBase+20">
          {selected}
        </Typography.Text>
      );
    }
    return (
      <Typography.Text size="callout" color="neutralBase">
        {label}
      </Typography.Text>
    );
  };

  return (
    <View>
      <View>
        <Typography.Text size="callout" weight="medium" color="primaryBase">
          {title} {isOptional && <Typography.Text size="footnote">- Optional</Typography.Text>}
        </Typography.Text>
        {helperText && (
          <Typography.Text size="caption1" color="neutralBase">
            {helperText}
          </Typography.Text>
        )}
      </View>
      <View style={selectContainerStyle}>
        <Dropdown
          dropdownVisible={isOpen}
          title={
            <Pressable onPress={toggleSelect}>
              <View style={[selectStyle, isOpen && isActiveStyle]}>
                {renderSelected()}
                <View style={toggleIconStyle}>
                  {isOpen ? <UpArrowIcon width={iconDimensions} /> : <DownArrowIcon width={iconDimensions} />}
                </View>
              </View>
            </Pressable>
          }
          content={
            <View style={optionListStyle}>
              <ScrollView>
                {data.map((item: Option, index: number) => (
                  <SelectOption
                    onSelect={SelectionHandler}
                    key={`${name}_${index}`}
                    item={item}
                    index={index}
                    selected={selected}
                  />
                ))}
              </ScrollView>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default SelectInput;
