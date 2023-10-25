import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ArrowUp, DividerHeaderIcon } from "../assets/icons";
import InformationIndicatorsModal from "./InformationIndicatorsModal";
import Tags from "./Tags";

export default function MutualFundDetailsHeader() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette.primaryBase,
  }));
  // TODO: add values from api integration
  return (
    <Stack direction="vertical" align="stretch">
      <Stack direction="vertical" gap="16p" align="stretch" style={contentContainerStyle}>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="supportBase-30" size="title3" weight="medium">
            Al Rajhi Conservative Fund
          </Typography.Text>
          <Tags riskName={t("MutualFund.MutualFundDetailsScreen.highRisk")} />
        </Stack>
        <Stack direction="vertical" gap="4p">
          <Stack direction="horizontal" gap="4p">
            <Typography.Text size="footnote" color="neutralBase-60" weight="regular">
              {t("MutualFund.MutualFundDetailsScreen.investedValue")}
            </Typography.Text>
            <InfoCircleIcon color="#FFFFFF" />
          </Stack>
          <Typography.Text size="large" weight="bold" color="supportBase-30">
            3,485.58
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="space-between">
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="footnote" weight="regular" color="neutralBase-60">
              {t("MutualFund.MutualFundDetailsScreen.NAV")}
            </Typography.Text>
            <Typography.Text size="callout" weight="bold" color="supportBase-30">
              {t("MutualFund.MutualFundDetailsScreen.sar", { value: "503.82" })}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" gap="4p" align="flex-end">
            <Typography.Text size="footnote" weight="regular" color="neutralBase-60">
              {t("MutualFund.MutualFundDetailsScreen.YTD")}
            </Typography.Text>
            <Stack direction="horizontal" gap="4p" align="center">
              <Typography.Text color="successBase" size="callout" weight="medium">
                15.18
              </Typography.Text>
              <ArrowUp color="#00AC86" />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="horizontal" justify="space-between">
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="footnote" weight="regular" color="neutralBase-60">
              {t("MutualFund.MutualFundDetailsScreen.inceptionDate")}
            </Typography.Text>
            <Typography.Text size="callout" weight="bold" color="supportBase-30">
              10/16/2019
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" gap="4p" align="flex-end">
            <Typography.Text size="footnote" weight="regular" color="neutralBase-60">
              {t("MutualFund.MutualFundDetailsScreen.valuationDate")}
            </Typography.Text>
            <Typography.Text size="callout" weight="bold" color="supportBase-30">
              08/17/2023
            </Typography.Text>
          </Stack>
        </Stack>
        <InformationIndicatorsModal
          isVisible={isVisible}
          onPressInfoIcon={() => {
            setIsVisible(false);
          }}
        />
      </Stack>
      <Stack direction="vertical" style={styles.dividerHeaderStyle}>
        <DividerHeaderIcon width="100%" height="100%" />
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  dividerHeaderStyle: {
    aspectRatio: 15.6,
    marginTop: -2,
    width: "100%",
  },
});
