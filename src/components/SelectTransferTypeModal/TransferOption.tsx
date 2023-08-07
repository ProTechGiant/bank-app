import { Pressable } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface TransferOptionProps {
  onPress: () => void;
  title: string;
  helperText: string;
}

export default function TransferOption({ onPress, title, helperText }: TransferOptionProps) {
  return (
    <Pressable onPress={onPress}>
      <Stack direction="vertical" style={{ rowGap: 2 }}>
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
