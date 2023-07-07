import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CategoryCell, CustomerBalance } from "../components";
import { useCategories } from "../hooks/query-hooks";

export default function TopSpendingScreen() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { includedCategories, total, excludedCategories, isLoading } = useCategories();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const currentDate = new Date();

  const monthName = currentDate.toLocaleString("en", { month: "long" });

  const handleBack = () => {
    navigation.goBack();
  };

  const sectionList = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("TopSpending.TopSpendingScreen.spendingInsights")} onBackPress={handleBack} />
      {!isLoading && total ? <CustomerBalance month={monthName} total={total} /> : null}
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
          renderItem={({ item }) => <CategoryCell category={item} />}
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
