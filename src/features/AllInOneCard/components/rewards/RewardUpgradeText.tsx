import { useTranslation } from "react-i18next";

import { Link, Stack, Typography } from "@/components";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";

interface RewardUpgradeTextProps {
  amount: number;
}

export default function RewardUpgradeText({ amount }: RewardUpgradeTextProps) {
  const { t } = useTranslation();

  const handleLinkPress = () => {
    //  TODO : handle it
  };

  return (
    <Stack direction="vertical">
      <Stack direction="horizontal" align="baseline">
        <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
          {t("AllInOneCard.Rewards.labelYouWouldHaveEarnedPart1")}
        </Typography.Text>
        <FormatTransactionAmount
          amount={amount}
          isPlusSignIncluded={false}
          integerSize="callout"
          decimalSize="caption2"
          color="neutralBase-60"
          isCurrencyIncluded={false}
          currencyColor="neutralBase-30"
        />
        <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
          {" "}
          {t("AllInOneCard.Rewards.labelYouWouldHaveEarnedPart2")}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="baseline">
        <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
          {t("AllInOneCard.Rewards.labelYouWouldHaveEarnedPart3")}
        </Typography.Text>
        <Typography.Text color="neutralBase-60" weight="bold" size="body">
          {t("AllInOneCard.Rewards.labelYouWouldHaveEarnedPart4")}
        </Typography.Text>
        <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
          {" "}
          {t("AllInOneCard.Rewards.labelYouWouldHaveEarnedPart5")}
        </Typography.Text>
        <Link onPress={handleLinkPress}>{t("AllInOneCard.Rewards.labelYouWouldHaveEarnedPart6")}</Link>
      </Stack>
    </Stack>
  );
}
