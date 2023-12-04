import { format } from "date-fns";
import { isAfter } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import NetworkImage from "@/components/NetworkImage";
import PlaceholderImage from "@/components/PlaceholderImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { BillItem } from "../types";

interface BillItemCardProps {
  data: BillItem;
  onPress: () => void;
}

export default function BillItemCard({ onPress, data }: BillItemCardProps) {
  const { t } = useTranslation();
  const arrowColor = useThemeStyles(t => t.palette["neutralBase-20"]);

  const isBillDatePassed = useMemo(() => {
    const todayDate = new Date();
    const billDate = new Date(data.DueDate);

    return isAfter(todayDate, billDate);
  }, [data.DueDate]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    justifyContent: "space-evenly",
    paddingBottom: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["4p"],
    flex: 1,
    flexWrap: "wrap",
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" style={containerStyle} gap="16p" align="center" justify="space-evenly">
        {data.iconUrl !== undefined && data.iconUrl !== "" ? (
          <NetworkImage
            source={{ uri: data.iconUrl }}
            style={styles.iconStyle}
            resizeMode="contain"
            resizeMethod="scale"
          />
        ) : (
          <PlaceholderImage style={styles.iconStyle} resizeMode="contain" resizeMethod="scale" />
        )}
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="callout" weight="regular" color="neutralBase+30">
            {data.BillName}
          </Typography.Text>
          <Typography.Text ellipsizeMode="tail" numberOfLines={2} size="caption1" color="neutralBase">
            {data.AccountNumber}
          </Typography.Text>
        </Stack>

        <Stack direction="vertical" gap="4p" style={styles.amountText}>
          <Typography.Text size="callout" weight="regular" color="neutralBase+30">
            {data.Amount + t("SadadBillPayments.BillPaymentHomeScreen.SAR")}
          </Typography.Text>
          <Typography.Text size="caption2" color={isBillDatePassed ? "errorBase" : "neutralBase+30"}>
            {t("SadadBillPayments.BillPaymentHomeScreen.due") + format(new Date(data.DueDate), "dd MMM yyy")}
          </Typography.Text>
        </Stack>
        <View style={styles.chevronContainer}>
          <ChevronRightIcon color={arrowColor} />
        </View>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  amountText: {
    alignItems: "flex-end",
    flex: 1,
  },
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  iconStyle: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 40,
  },
});
