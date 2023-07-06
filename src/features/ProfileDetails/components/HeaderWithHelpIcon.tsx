import { Pressable } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

import { HelpIcon } from "../assets/icons";

interface HeaderWithHelpIconProps {
  title: string;
  onPress: () => void;
}

export default function HeaderWithHelpIcon({ title, onPress }: HeaderWithHelpIconProps) {
  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" align="center" justify="flex-start" gap="8p">
        <Typography.Text weight="medium" size="title3">
          {title}
        </Typography.Text>
        <HelpIcon width={20} height={20} />
      </Stack>
    </Pressable>
  );
}
