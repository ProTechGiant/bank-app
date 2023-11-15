import { Pressable } from "react-native";
import { SvgProps } from "react-native-svg";

import { Stack, Typography } from "@/components";

interface CardActionProps {
  icon: React.ReactElement<SvgProps>;
  text: string;
  onPress?: () => void;
}

export default function CardAction({ icon, text, onPress }: CardActionProps) {
  return (
    <Pressable onPress={onPress}>
      <Stack direction="vertical" gap="8p" align="center">
        {icon}
        <Typography.Text weight="bold" size="footnote">
          {text}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}
