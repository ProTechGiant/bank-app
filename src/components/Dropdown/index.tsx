import { View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface DropdownProps {
  title: JSX.Element;
  dropdownVisible: boolean;
  content: JSX.Element;
}

export default function Dropdown({ title, dropdownVisible, content }: DropdownProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
    }),
    []
  );

  return (
    <View style={container}>
      {title}
      {dropdownVisible && content}
    </View>
  );
}
