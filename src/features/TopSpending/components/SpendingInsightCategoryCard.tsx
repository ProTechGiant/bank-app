import { format, lastDayOfMonth, parse } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { Theme, useThemeStyles } from "@/theme";

import { Category } from "../types";
import CategoryCell from "./CategoryCell";

interface SpendingInsightsCategoryCardProps {
  categories: Category[];
  label: string;
  iconColor: keyof Theme["palette"];
}

export default function SpendingInsightsCategoryCard({
  categories,
  label,
  iconColor,
}: SpendingInsightsCategoryCardProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [seeAll, setSeeAll] = useState<boolean>(false);

  const dateFormatter = (dateString: string) => {
    const date = parse(dateString, "MMMM yyyy", new Date());
    const startDate = format(date, "yyyy-MM-dd");
    const endDate = format(lastDayOfMonth(date), "yyyy-MM-dd");
    return { startDate, endDate };
  };

  const handleOnCategoryTransactions = (insightsSpendingCategory: Category) => {
    navigation.navigate("TopSpending.SpendSummaryScreen", {
      categoryId: insightsSpendingCategory.categoryId,
      categoryName: insightsSpendingCategory.categoryName,
      iconPath: insightsSpendingCategory.iconPath,
      ...dateFormatter(label), //pass startDate & endDate in prop
    });
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <View style={titleContainerStyle}>
        <Typography.Text size="title3" weight="medium" color="neutralBase+30">
          {t("TopSpending.SpendingComparisonScreen.topSpendingIn")}
          {label}
        </Typography.Text>
        {!seeAll && categories?.length > 3 ? (
          <Pressable onPress={() => setSeeAll(true)}>
            <Typography.Text size="footnote" color="interactionBase">
              {t("TopSpending.SpendSummaryScreen.seeAll")}
            </Typography.Text>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        data={seeAll ? categories : categories.slice(0, 3)}
        renderItem={({ item }) => (
          <CategoryCell
            color={iconColor}
            category={item}
            isTag={false}
            onPress={() => handleOnCategoryTransactions(item)}
          />
        )}
        keyExtractor={item => item.categoryId.toString()}
      />
    </View>
  );
}
