import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, SectionList, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CategoryCell, CustomerBalance } from "../components";
import { useCategories, useTransactionTags } from "../hooks/query-hooks";
import { userType } from "../mocks";
import { Tag } from "../types";

type CategoryProps = {
  categoryId: string;
  categoryName: string;
  iconPath: string;
  totalAmount: number;
  TagId: number;
};

export default function TopSpendingScreen() {
  const { t } = useTranslation();

  const [isExpandedCategory, setIsExpandedCategory] = useState(false);
  const [isExpandedTag, setIsExpandedTag] = useState(false);

  const { includedCategories, total, excludedCategories, isLoading } = useCategories();
  const { tags, tagsLoading } = useTransactionTags();

  const navigation = useNavigation();
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("en", { month: "long" });

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnCategoryTransactions = (category: CategoryProps & Tag, screen: string) => {
    if (screen === t("TopSpending.TopSpendingScreen.excludedfromSpending")) {
      navigation.navigate("TopSpending.ExcludedDetailedScreen", {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        totalAmount: category.totalAmount,
      });
    } else if (screen === t("TopSpending.TopSpendingScreen.topSpendingByTags")) {
      navigation.navigate("TopSpending.SingleTagScreen", {
        data: category,
      });
    } else {
      navigation.navigate("TopSpending.SpendSummaryScreen", {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        iconPath: category.iconPath,
      });
    }
  };

  const sectionList = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const sectionHeader = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const imagesStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("TopSpending.TopSpendingScreen.spendingInsights")} onBackPress={handleOnBackPress} />
      {!isLoading && total ? (
        <>
          <CustomerBalance month={monthName} total={total} />
          <View style={imagesStyle}>
            {userType !== "plusTier" ? <Image source={require("../assets/images/hidden-text.png")} /> : null}
            <Image source={require("../assets/images/hidden-graph.png")} />
          </View>
        </>
      ) : null}

      {!isLoading && includedCategories && excludedCategories && !tagsLoading && tags ? (
        <SectionList
          style={sectionList}
          sections={[
            {
              data: isExpandedCategory ? includedCategories : includedCategories.slice(0, 3),
              title: t("TopSpending.TopSpendingScreen.topSpendingInMonth") + monthName,
              expandView: includedCategories.length > 3 ? true : false,
              isExpanded: isExpandedCategory,
              onExpand: () => setIsExpandedCategory(!isExpandedCategory),
              isTag: false,
            },
            {
              data: isExpandedTag ? tags : tags.slice(0, 3),
              title: t("TopSpending.TopSpendingScreen.topSpendingByTags"),
              expandView: tags.length > 3 ? true : false,
              isExpanded: isExpandedTag,
              onExpand: () => setIsExpandedTag(!isExpandedTag),
              isTag: true,
            },
            {
              data: excludedCategories,
              title: t("TopSpending.TopSpendingScreen.excludedfromSpending"),
              expandView: false,
              isTag: false,
            },
          ]}
          renderItem={({ item, section: { isTag, title } }) => (
            <CategoryCell category={item} isTag={isTag} onPress={() => handleOnCategoryTransactions(item, title)} />
          )}
          keyExtractor={(_item, index) => String(index)}
          renderSectionHeader={({ section: { title, expandView, onExpand, isExpanded } }) => (
            <Stack style={sectionHeader} direction="horizontal" align="center" justify="space-between">
              <Typography.Text size="body" weight="semiBold" color="neutralBase+30">
                {title}
              </Typography.Text>
              {expandView ? (
                <TouchableOpacity onPress={onExpand}>
                  <Typography.Text size="footnote" weight="regular" color="interactionBase">
                    {isExpanded
                      ? t("TopSpending.TopSpendingScreen.seeLess")
                      : t("TopSpending.TopSpendingScreen.seeAll")}
                  </Typography.Text>
                </TouchableOpacity>
              ) : null}
            </Stack>
          )}
        />
      ) : null}
    </Page>
  );
}
