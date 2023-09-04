import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ReasonRadioButtonProps<T> {
  disabled?: boolean;
  title: string;
  description: string;
  onPress?: (value: T | undefined) => void;
  isSelected?: boolean;
  testID?: string;
  value?: T;
}

export default function ReasonRadioButton<T>({
  disabled = false,
  title,
  description,
  onPress,
  isSelected,
  testID,
  value,
}: ReasonRadioButtonProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-50"],
    marginVertical: theme.spacing["8p"],
    borderWidth: 1,
    borderRadius: theme.spacing["8p"],
    borderColor: theme.palette["neutralBase-30"],
    paddingHorizontal: theme.spacing["16p"],
    flex: 1,
  }));

  const descriptionStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+10"],
    marginTop: theme.spacing["8p"],
  }));

  return (
    <Pressable onPress={() => onPress?.(value)} disabled={disabled} testID={testID}>
      <View style={containerStyle}>
        <Stack direction="vertical" style={styles.stackContainer}>
          <Typography.Text weight="medium" size="callout" style={[styles.title, { opacity: disabled ? 0.2 : 1 }]}>
            {title}
          </Typography.Text>
          <Typography.Text weight="regular" size="footnote" style={[descriptionStyle, { opacity: disabled ? 0.2 : 1 }]}>
            {description}
          </Typography.Text>
        </Stack>
        <View style={styles.radioButtonContainer}>
          <Radio onPress={() => onPress?.(value)} isSelected={isSelected} disabled={disabled} value={value} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  radioButtonContainer: { alignItems: "flex-end", alignSelf: "center", width: "22%" },
  stackContainer: {
    width: "78%",
  },
  title: {
    flexGrow: 1,
  },
});
