import { Pressable } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface TransferOptionProps {
  onPress: () => void;
  title: string;
  helperText: string;
  testID?: string;
}

export default function TransferOption({ onPress, title, helperText, testID }: TransferOptionProps) {
  return (
    <Pressable onPress={onPress} testID={testID}>
      <Stack direction="vertical" gap="4p">
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
