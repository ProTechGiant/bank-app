import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface DetailSectionProps {
  title: string;
  value: string;
  isExpireSoon?: boolean;
  isUpdateNowButtonVisible?: boolean;
  expiredDescription?: string;
  onPress?: () => void;
}

export default function DetailSection({
  isExpireSoon,
  expiredDescription,
  onPress,
  title,
  value,
  isUpdateNowButtonVisible,
}: DetailSectionProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="vertical" gap="16p">
      <Stack direction="vertical" gap="4p">
        <Typography.Text size="footnote" color="neutralBase-10">
          {title}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium" color={isExpireSoon ? "complimentBase+20" : undefined}>
          {value}
        </Typography.Text>
        {isExpireSoon ? (
          <Typography.Text size="caption2" color="complimentBase+20">
            {expiredDescription}
          </Typography.Text>
        ) : null}
      </Stack>
      {isExpireSoon && isUpdateNowButtonVisible ? (
        <Button onPress={onPress} size="small" variant="secondary">
          {t("ProfileDetails.ProfileDetailsScreen.updateNow")}
        </Button>
      ) : null}
    </Stack>
  );
}
