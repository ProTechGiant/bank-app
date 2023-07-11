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
import { useCategories } from "../hooks/query-hooks";
import { userType } from "../mocks";

type CategoryProps = {
  categoryId: string;
  categoryName: string;
  iconPath: string;
  totalAmount: number;
};

export default function TopSpendingScreen() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { includedCategories, total, excludedCategories, isLoading } = useCategories();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const currentDate = new Date();

  const monthName = currentDate.toLocaleString("en", { month: "long" });

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnCategoryTransactions = (category: CategoryProps, screen: string) => {
    if (screen === t("TopSpending.TopSpendingScreen.excludedfromSpending")) {
      navigation.navigate("TopSpending.ExcludedDetailedScreen", {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        totalAmount: category.totalAmount,
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

  const imagesStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["10p"],
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

      {!isLoading && includedCategories && excludedCategories ? (
        <SectionList
          style={sectionList}
          sections={[
            {
              data: isExpanded ? includedCategories : includedCategories.slice(0, 3),
              title: t("TopSpending.TopSpendingScreen.topSpendingInMonth") + monthName,
              expandView: includedCategories.length > 3 ? true : false,
            },
            {
              data: excludedCategories,
              title: t("TopSpending.TopSpendingScreen.excludedfromSpending"),
              expandView: false,
            },
          ]}
          renderItem={({ item, section }) => (
            <CategoryCell category={item} onPress={() => handleOnCategoryTransactions(item, section.title)} />
          )}
          keyExtractor={(item, index) => String(index)}
          renderSectionHeader={({ section: { title, expandView } }) => (
            <Stack direction="horizontal" align="center" justify="space-between">
              <Typography.Text size="body" weight="semiBold" color="neutralBase+30">
                {title}
              </Typography.Text>
              {expandView ? (
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
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
