import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useCategories } from "../hooks/query-hooks";
import TopCategoryItem from "./TopCategoryItem";

interface TopSpendingCategoriesProps {
  accountId: string;
}
export default function TopSpendingCategories({ accountId }: TopSpendingCategoriesProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isRTL = I18nManager.isRTL;

  const currentMonthName = isRTL ? format(new Date(), "MMMM", { locale: arLocale }) : format(new Date(), "MMMM");

  const { includedTopCategories, total } = useCategories(accountId);
  const handleOnPress = () => {
    navigation.navigate("TopSpending.TopSpendingStack", {
      screen: "TopSpending.TopSpendingScreen",
    });
  };
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
  }));
  const currectSpendingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["12p"],
  }));
  const topCategoriesStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["24p"],
  }));
  const viewAllContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
    width: "70%",
  }));
  return (
    <ContentContainer style={contentStyle}>
      <Stack direction="vertical" gap="4p" style={currectSpendingStyle}>
        <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
          {t("Home.TopSpendingCategories.currentSpending")} {currentMonthName}
        </Typography.Text>
        <Typography.Text color="neutralBase+30" size="title3" weight="bold">
          {total} {t("Home.TopSpendingCategories.SAR")}
        </Typography.Text>
      </Stack>
      <Divider height={4} color="neutralBase-40" />
      <Stack direction="vertical" gap="12p" style={topCategoriesStyle}>
        {includedTopCategories && includedTopCategories.length > 0 ? (
          <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
            {t("Home.TopSpendingCategories.topCategories")}
          </Typography.Text>
        ) : null}
        {includedTopCategories && includedTopCategories.length > 0 ? (
          includedTopCategories.map(topCategoryItem => {
            const apiPercentageNumber = parseFloat(topCategoryItem.percentage.replace("%", ""));
            const formattedPercentage = `${apiPercentageNumber.toFixed(2)}%`;
            return (
              <TopCategoryItem
                key={topCategoryItem.categoryId}
                name={topCategoryItem.categoryName}
                percent={formattedPercentage}
                totalAmount={topCategoryItem.totalAmount}
                currency={topCategoryItem.currency}
                iconPath={topCategoryItem.iconPath}
                iconViewBox={topCategoryItem.iconViewBox}
              />
            );
          })
        ) : (
          <Stack direction="vertical">
            <View style={styles.notSpendingContainerStyle}>
              <Typography.Text align="center" color="neutralBase+30" size="callout" weight="medium">
                {t("Home.TopSpendingCategories.noSpending")}
              </Typography.Text>
            </View>
            <View style={[styles.notSpendingContainerStyle, styles.noSpendingInformationStyle]}>
              <Typography.Text align="center" color="neutralBase+10" size="footnote" weight="regular">
                {t("Home.TopSpendingCategories.noSpendingInformation")}
              </Typography.Text>
            </View>
          </Stack>
        )}
      </Stack>
      {includedTopCategories && includedTopCategories.length > 0 ? (
        <View style={viewAllContainer}>
          <Button size="small" onPress={handleOnPress}>
            {t("Home.TopSpendingCategories.viewAllSpending")}
          </Button>
        </View>
      ) : null}
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  noSpendingInformationStyle: {
    marginTop: 8,
  },
  notSpendingContainerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
});
