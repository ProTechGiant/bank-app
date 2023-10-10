import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { GoldIcon } from "@/assets/icons/GoldIcon";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

interface GoldWalletSectionProps {
  onPress: () => void;
}
export function GoldWalletSection({ onPress }: GoldWalletSectionProps) {
  const { t } = useTranslation();

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  }));
  return (
    <Stack direction="horizontal" style={contentContainerStyle}>
      <Stack direction="vertical" gap="8p">
        <Typography.Text weight="bold">{t("Home.DashboardScreen.GoldSection.title")}</Typography.Text>
        <Typography.Text size="footnote">{t("Home.DashboardScreen.GoldSection.subtitle")}</Typography.Text>
        <Typography.Text size="caption2" color="neutralBase+10">
          {t("Home.DashboardScreen.GoldSection.caption")}
        </Typography.Text>
        <Button onPress={onPress} size="mini">
          {t("Home.DashboardScreen.GoldSection.button")}
        </Button>
      </Stack>
      <GoldIcon />
    </Stack>
  );
}
