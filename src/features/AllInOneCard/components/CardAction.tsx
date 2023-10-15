import { SvgProps } from "react-native-svg";

import { Stack, Typography } from "@/components";

interface CardActionProps {
  icon: React.ReactElement<SvgProps>;
  text: string;
}

export default function CardAction({ icon, text }: CardActionProps) {
  return (
    <Stack direction="vertical" gap="8p" align="center">
      {icon}
      <Typography.Text weight="bold" size="footnote">
        {text}
      </Typography.Text>
    </Stack>
  );
}
