import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Path, Svg } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import IconGenerator from "@/components/IconGenerator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { categoryIconViewBox } from "../mocks/MockData";
import { Category, Tag } from "../types";

interface CategoryCellProps {
  category: Category & Tag;
  onPress: () => void;
  isTag: boolean;
  iconBackgroundColor?: string;
}

export default function CategoryCell({ category, onPress, isTag, iconBackgroundColor }: CategoryCellProps) {
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
    iconColor: theme.palette.primaryBase,
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
            width={24}
            height={24}
            path={iconPath?.replace('d="', "").replace('"', "")}
            color={iconColor}
            viewBox={getViewBox(name)}
          />
          <View style={styles.tagContainerStyle}>
            <Svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
              <Path
                d="M3.47184 7.22527C4.03367 2.7306 8.21169 -0.401509 12.6836 0.319558L35.0653 3.92849C38.8271 4.53506 41.639 7.71062 41.7858 11.5182L42.6796 34.6917C42.8545 39.2275 39.2247 43 34.6855 43H8.06225C3.25027 43 -0.472818 38.7825 0.124035 34.0077L3.47184 7.22527Z"
                fill={iconBackgroundColor}
              />
            </Svg>
          </View>
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
  tagContainerStyle: { position: "absolute", zIndex: -1 },
});
