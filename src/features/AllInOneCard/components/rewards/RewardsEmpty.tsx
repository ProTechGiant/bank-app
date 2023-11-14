import { useTranslation } from "react-i18next";

import { Stack, Typography } from "@/components";

import { EmptyRewardsIllustration } from "../../assets/icons";

export default function RewardsEmpty() {
  const { t } = useTranslation();

  return (
    <Stack direction="vertical" justify="center" align="center" gap="8p" flex={1}>
      <EmptyRewardsIllustration />
      <Typography.Text color="neutralBase+30">{t("AllInOneCard.Rewards.noRewardsEarned")}</Typography.Text>
      <Typography.Text align="center" weight="regular" size="footnote" color="neutralBase">
        {t("AllInOneCard.Rewards.startEarningRewards")}
      </Typography.Text>
    </Stack>
  );
}
