import { StyleSheet, View } from "react-native";

import { palette, radii } from "@/theme/values";

interface DropdownProps {
  title: JSX.Element;
  dropdownVisible: boolean;
  content: JSX.Element;
}

export default function Dropdown({ title, dropdownVisible, content }: DropdownProps) {
  return (
    <View style={styles.container}>
      {title}
      {dropdownVisible && content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
  },
});
