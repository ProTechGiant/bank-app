import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { IconGenerator } from "../components";

type CellProps = {
  categoryId?: string;
  categoryName?: string;
  totalAmount: number;
  percentage?: string;
  currency: string;
  transactionCount: number;
  iconPath: string;
};

interface CategoryCellProps {
  category: CellProps;
  onPress: () => void;
}

export default function CategoryCell({ category, onPress }: CategoryCellProps) {
  const { categoryName, percentage, totalAmount, transactionCount, currency, iconPath } = category;

  const { t } = useTranslation();

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { chevronColor, giftColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    giftColor: theme.palette["primaryBase-40"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        <IconGenerator path={iconPath?.replace('d="', "").replace('"', "")} color={giftColor} />
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {categoryName ? categoryName : t("TopSpending.TopSpendingScreen.hidden")}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase">
            {percentage
              ? `${parseFloat(percentage).toFixed(1)}%`
              : transactionCount + " " + t("TopSpending.TopSpendingScreen.transaction")}
          </Typography.Text>
        </Stack>
        <Typography.Text size="callout" color="neutralBase+30">
          {formatCurrency(totalAmount, currency)}
        </Typography.Text>
        <Pressable style={styles.pressable}>
          <ChevronRightIcon color={chevronColor} />
        </Pressable>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
  pressable: {
    transform: [
      {
        scaleX: I18nManager.isRTL ? -1 : 1,
      },
    ],
  },
});
