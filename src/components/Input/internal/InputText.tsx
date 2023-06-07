import { cloneElement } from "react";
import { StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InputTextProps {
  buttonIcon?: React.ReactElement;
  placeholder?: string;
  value?: string;
}

export default function InputText({ buttonIcon, placeholder, value }: InputTextProps) {
  const buttonIconColor = useThemeStyles(t => t.palette.neutralBase);

  return (
    <View style={styles.container}>
      <Typography.Text
        color={undefined !== value ? "neutralBase+30" : "neutralBase-10"}
        size="callout"
        weight="regular">
        {value ?? placeholder}
      </Typography.Text>
      {undefined !== buttonIcon ? cloneElement(buttonIcon, { color: buttonIconColor }) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "space-between",
  },
});
