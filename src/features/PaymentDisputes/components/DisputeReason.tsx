import { Pressable, View } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DisputeReasonProps {
  text: string;
  onPress: () => void;
}

export default function DisputeReason({ text, onPress }: DisputeReasonProps) {
  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);
  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" align="center" gap="16p">
        <View style={{ flex: 1 }}>
          <Typography.Text size="callout" weight="medium">
            {text}
          </Typography.Text>
        </View>
        <ChevronRightIcon color={iconColor} />
      </Stack>
    </Pressable>
  );
}
