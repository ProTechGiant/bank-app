import { StyleSheet, View } from "react-native";

import { palette, radii } from "@/theme/values";

interface DropdownProps {
  Title: JSX.Element;
  dropdownVisible: boolean;
  Content: JSX.Element;
}

export default function Dropdown({ Title, dropdownVisible, Content }: DropdownProps) {
  return (
    <View style={styles.container}>
      {Title}
      {dropdownVisible && Content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
  },
});
