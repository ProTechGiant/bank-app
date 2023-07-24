import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import NoArticlesIcon from "@/assets/icons/NoArticlesIcon";
import Button from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EmptyDataWarningCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

export default function EmptyDataWarningCard({ title, description, onPress }: EmptyDataWarningCardProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    justifyContent: "space-evenly",
    paddingBottom: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["4p"],
    flex: 1,
    flexWrap: "wrap",
  }));

  return (
    <Stack direction="vertical" style={containerStyle} gap="16p" align="center">
      <NoArticlesIcon />

      <Typography.Text size="title3" weight="bold" color="neutralBase+30">
        {title}
      </Typography.Text>
      <Typography.Text size="callout" align="center" color="neutralBase">
        {description}
      </Typography.Text>
      <Button onPress={onPress} variant="secondary">
        {t("SadadBillPayments.BillPaymentHomeScreen.addBill")}
      </Button>
    </Stack>
  );
}
