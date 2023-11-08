import Stack from "@/components/Stack";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SavingPotSectionProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function SavingPotSection({ title, description, imageUrl }: SavingPotSectionProps) {
  const iconColor = useThemeStyles(theme => theme.palette["complimentBase-10"]);

  return (
    <Stack direction="horizontal" gap="8p">
      <SvgIcon uri={imageUrl} width={20} height={20} color={iconColor} />

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
