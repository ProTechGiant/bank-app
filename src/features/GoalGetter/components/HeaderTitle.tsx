import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface HeaderTitleProps {
  headerText: string;
  headerDescriptionText: string;
}

export default function HeaderTitle({ headerText, headerDescriptionText }: HeaderTitleProps) {
  return (
    <Stack direction="vertical" gap="12p">
      <Typography.Text size="title1" weight="medium">
        {headerText}
      </Typography.Text>
      <Typography.Text size="callout" weight="regular">
        {headerDescriptionText}
      </Typography.Text>
    </Stack>
  );
}
