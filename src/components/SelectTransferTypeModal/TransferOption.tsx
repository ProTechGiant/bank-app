import { Pressable, StyleSheet } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface TransferOptionProps {
  onPress: () => void;
  title: string;
  testID?: string;
  helperText: string;
}

export default function TransferOption({ onPress, title, testID, helperText }: TransferOptionProps) {
  return (
    <Pressable onPress={onPress} testID={testID}>
      <Stack direction="vertical" style={styles.stack}>
        <Typography.Text size="callout" weight="medium" color="neutralBase+30">
          {title}
        </Typography.Text>
        <Typography.Text size="caption1" color="neutralBase" weight="regular">
          {helperText}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: {
    rowGap: 2,
  },
});
