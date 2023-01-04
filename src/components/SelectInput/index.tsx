import { useField } from "formik";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { DownArrowIcon, UpArrowIcon } from "@/assets/icons";
import Dropdown from "@/components/Dropdown";
import Typography from "@/components/Typography";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";

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
      <View style={styles.selectContainer}>
        <Dropdown
          dropdownVisible={isOpen}
          title={
            <Pressable onPress={toggleSelect}>
              <View style={[styles.select, isOpen && styles.isActive]}>
                {renderSelected()}
                <View style={styles.toggleIcon}>
                  {isOpen ? (
                    <UpArrowIcon width={iconDimensions.dropdown} />
                  ) : (
                    <DownArrowIcon width={iconDimensions.dropdown} />
                  )}
                </View>
              </View>
            </Pressable>
          }
          content={
            <View style={styles.optionList}>
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

const styles = StyleSheet.create({
  isActive: {
    borderColor: palette.complimentBase,
    borderWidth: 2,
  },
  optionList: {
    maxHeight: 174,
    paddingLeft: spacing.medium,
  },
  select: {
    backgroundColor: palette["neutralBase-50"],
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.medium,
  },
  selectContainer: {
    marginTop: spacing.medium,
  },
  toggleIcon: {
    alignItems: "flex-end",
    height: iconDimensions.accordian,
    justifyContent: "center",
    width: iconDimensions.accordian,
  },
});
