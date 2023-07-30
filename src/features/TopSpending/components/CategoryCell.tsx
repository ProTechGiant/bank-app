import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import IconGenerator from "@/components/IconGenerator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { categoryIconViewBox } from "../mocks/MockData";
import { Category, Tag } from "../types";

interface CategoryCellProps {
  category: Category & Tag;
  onPress: () => void;
  isTag: boolean;
  color?: keyof Theme["palette"];
}

export default function CategoryCell({ category, onPress, isTag, color }: CategoryCellProps) {
  const { t } = useTranslation();

  // this code will be removed when the backend send the the tags with pascal case
  const cellDate = {
    name: isTag ? category.TagName : category.categoryName,
    percentage: isTag ? category.Percentage : category.percentage,
    totalAmount: isTag ? category.Amount : category.totalAmount,
    transactionCount: isTag ? category.TransactionCount : category.transactionCount,
    currency: isTag ? category.Currency : category.currency,
    iconPath: isTag ? category.TagIcon : category.iconPath,
  };
  const { name, percentage, totalAmount, transactionCount, currency, iconPath } = cellDate;

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { chevronColor, iconColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    iconColor: color ? theme.palette[color] : theme.palette.complimentBase,
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
  }));

  const getViewBox = (iconName: string) => categoryIconViewBox[iconName as keyof typeof categoryIconViewBox];

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        <View style={iconContainerStyle}>
          <IconGenerator
            width={22}
            height={22}
            path={iconPath?.replace('d="', "").replace('"', "")}
            color={iconColor}
            viewBox={getViewBox(name)}
          />
        </View>
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" color="neutralBase+30">
            {name ? name : t("TopSpending.TopSpendingScreen.hidden")}
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
        <View style={styles.pressable}>
          <ChevronRightIcon color={chevronColor} />
        </View>
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
