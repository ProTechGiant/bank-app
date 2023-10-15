import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { InfoFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function EmptyTransactionsContent() {
  const { t } = useTranslation();

  const onBuyGoldPress = () => {
    //TODO  handle buy gold button
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    marginBottom: theme.spacing["64p"],
    alignItems: "center",
  }));

  const textsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    alignItems: "center",
    marginBottom: theme.spacing["12p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <ContentContainer style={contentContainerStyle}>
      <InfoFilledCircleIcon color={infoIconColor} />
      <Stack direction="vertical" gap="8p" style={textsContainerStyle}>
        <Typography.Text align="center" size="callout" color="primaryBase">
          {t("GoldWallet.noTransactionTitle")}
        </Typography.Text>
        <Typography.Text align="center" size="footnote" color="neutralBase">
          {t("GoldWallet.noTransactionSubtitle")}
        </Typography.Text>
      </Stack>
      <Button variant="primary-warning" onPress={onBuyGoldPress} size="mini">
        {t("GoldWallet.buyGold")}
      </Button>
    </ContentContainer>
  );
}
