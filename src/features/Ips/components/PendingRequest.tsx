import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Radio from "@/components/Radio";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

interface PendingRequestProps {
  name: string;
  amount: number;
  date: string;
  isSelected: boolean;
  setSelected: () => void;
}
export default function PendingRequest({ name, amount, date, isSelected, setSelected }: PendingRequestProps) {
  const { t } = useTranslation();
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));
  return (
    <Pressable onPress={setSelected} style={containerStyle}>
      <Stack direction="horizontal" align="center" gap="16p">
        <Radio isSelected={isSelected} onPress={setSelected} />
        <Stack direction="vertical">
          <Typography.Text>{name}</Typography.Text>
          <Typography.Text size="footnote" color="neutralBase">
            {date}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" style={styles.amountContainer}>
          <Typography.Text>{formatCurrency(amount, "SAR")}</Typography.Text>
          <Typography.Text size="caption1" color="neutralBase">
            {t("Ips.HubScreen.pending")}
          </Typography.Text>
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  amountContainer: {
    alignItems: "flex-end",
    flexGrow: 1,
  },
});
