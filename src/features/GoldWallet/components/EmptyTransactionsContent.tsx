import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ErrorCircleIcon } from "../assets/ErrorCircleIcon";

interface EmptyTransactionsContentProps {
  onBuyGoldPress: () => void;
}

export default function EmptyTransactionsContent({ onBuyGoldPress }: EmptyTransactionsContentProps) {
  const { t } = useTranslation();

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
      <ErrorCircleIcon color={infoIconColor} />
      <Stack direction="vertical" style={textsContainerStyle}>
        <Typography.Text align="center" size="callout" color="neutralBase+30">
          {t("GoldWallet.noTransactionTitle")}
        </Typography.Text>
        <Typography.Text align="center" size="footnote" color="neutralBase">
          {t("GoldWallet.noTransactionSubtitle")}
        </Typography.Text>
      </Stack>
      <Button variant="secondary" onPress={onBuyGoldPress} size="mini">
        {t("GoldWallet.buyGold")}
      </Button>
    </ContentContainer>
  );
}
