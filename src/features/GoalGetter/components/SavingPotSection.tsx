import { SvgProps } from "react-native-svg";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface SavingPotSectionProps {
  title: string;
  description: string;
  icon: React.ReactElement<SvgProps>;
}

export default function SavingPotSection({ title, description, icon }: SavingPotSectionProps) {
  return (
    <Stack direction="horizontal" gap="16p">
      {icon}
      <Stack direction="vertical" gap="8p">
        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
          {description}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
