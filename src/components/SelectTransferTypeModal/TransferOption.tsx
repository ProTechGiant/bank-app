import i18next from "i18next";
import { Pressable, StyleSheet } from "react-native";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { palette } from "@/theme/values";

interface TransferOptionProps {
  onPress: () => void;
  title: string;
  testID?: string;
  helperText: string;
}

export default function TransferOption({ onPress, title, testID, helperText }: TransferOptionProps) {
  return (
    <Pressable onPress={onPress} testID={testID}>
      <Stack direction="horizontal" align="center" justify="space-between">
        <Stack direction="vertical" style={styles.stack}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {title}
          </Typography.Text>
          <Typography.Text size="caption1" color="neutralBase" weight="regular">
            {helperText}
          </Typography.Text>
        </Stack>
        {i18next.language === "ar" ? (
          <ChevronLeftIcon color={palette["neutralBase-20"]} />
        ) : (
          <ChevronRightIcon color={palette["neutralBase-20"]} />
        )}
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: {
    rowGap: 2,
  },
});
