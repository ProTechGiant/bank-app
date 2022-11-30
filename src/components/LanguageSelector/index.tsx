import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { Icons } from "@/assets/icons";
import { palette, spacing } from "@/theme/values";

// import AntDesign from "react-native-vector-icons/AntDesign";

const data = [
  { label: "العربية", value: "ar" },
  { label: "English", value: "en" },
];

const LanguageDropdown = () => {
  const [value, setValue] = useState(null);
  const Icon = Icons["Globe"];

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      activeColor={palette["neutralBase-20"]}
      placeholder=""
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      onChange={item => {
        setValue(item.value);
      }}
      renderLeftIcon={() => <Icon height={24} width={24} style={styles.icon} />}
    />
  );
};

export default LanguageDropdown;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: palette["neutralBase-20"],
    borderRadius: 8,
    height: 41,
    paddingHorizontal: spacing.small,
    width: 69,
  },
  icon: {
    marginRight: 3,
  },
  selectedTextStyle: {
    fontSize: 1,
  },
});
