import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InputCardProps {
  helperText?: string | false;
  onPress?: () => void;
  label?: string | null | false;
  value: React.ReactNode;
}

export default function InputCard({ helperText, label, onPress, value }: InputCardProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    textAlign: "center",
    paddingHorizontal: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
  }));

  const inputStype = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["16p"],
  }));

  const helperTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: theme.palette["neutralBase-30"],
    paddingTop: 12,
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Pressable onPress={onPress} style={inputStype}>
        <Typography.Text weight="medium" color="neutralBase+30">
          {label}
        </Typography.Text>
        <View style={styles.value}>{value}</View>
      </Pressable>
      {!!helperText && (
        <View style={helperTextContainerStyle}>
          <Typography.Text color="neutralBase" size="footnote">
            {helperText}
          </Typography.Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    alignItems: "center",
    flexDirection: "row",
  },
});
