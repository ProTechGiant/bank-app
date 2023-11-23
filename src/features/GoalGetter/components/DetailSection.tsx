import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface DetailSectionProps {
  title: string;
  value: string;
  testID?: string;
}

export default function DetailSection({ title, value, testID }: DetailSectionProps) {
  return (
    <Stack direction="vertical" gap="16p" testID={testID}>
      <Stack direction="vertical" gap="4p">
        <Typography.Text size="footnote" color="neutralBase-10">
          {title}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium">
          {value}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
