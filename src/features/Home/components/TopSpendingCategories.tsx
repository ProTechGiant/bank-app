import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { RefreshSection } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { AccountType } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useCategories } from "../hooks/query-hooks";
import TopCategoryItem from "./TopCategoryItem";

interface TopSpendingCategoriesProps {
  account: AccountType;
  testID?: string;
}

export default function TopSpendingCategories({ account, testID }: TopSpendingCategoriesProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isRTL = I18nManager.isRTL;

  const currentMonthName = isRTL ? format(new Date(), "MMMM", { locale: arLocale }) : format(new Date(), "MMMM");

  const { includedTopCategories, total, isError, refetch } = useCategories(account?.id);

  const handleOnPress = () => {
    navigation.navigate("TopSpending.TopSpendingStack", {
      screen: "TopSpending.TopSpendingScreen",
    });
  };

  const currectSpendingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase+30"],
    borderTopRightRadius: theme.radii.medium,
    borderTopLeftRadius: theme.radii.medium,
  }));

  const topCategoriesStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["24p"],
    borderTopRightRadius: theme.radii.medium,
    borderTopLeftRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-60"],
  }));
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderTopRightRadius: theme.radii.medium,
    borderTopLeftRadius: theme.radii.medium,
  }));

  return (
    <ContentContainer testID={testID} style={contentStyle}>
      <Stack direction="vertical" gap="4p" style={currectSpendingStyle} align="stretch">
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text color="neutralBase-20" size="footnote" weight="regular">
            {t("Home.TopSpendingCategories.currentSpending")} {currentMonthName}
          </Typography.Text>
          <Pressable onPress={handleOnPress}>
            <Typography.Text size="footnote" weight="medium" color="primaryBase-70">
              {t("Home.DashboardScreen.viewAll")}
            </Typography.Text>
          </Pressable>
        </Stack>
        <Typography.Text color="neutralBase-60" size="title3" weight="bold">
          {total} {t("Home.TopSpendingCategories.SAR")}
        </Typography.Text>
      </Stack>

      {/* <Divider height={4} color="neutralBase-40" /> */}
      <Stack direction="vertical" gap="12p" style={topCategoriesStyle}>
        {includedTopCategories && includedTopCategories.length > 0 ? (
          <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
            {t("Home.TopSpendingCategories.topCategories")}
          </Typography.Text>
        ) : null}
        {account?.id === undefined || isError ? (
          <View style={styles.refreshContainerStyle}>
            <RefreshSection
              testID={testID !== undefined ? `${testID}:RefreshSection` : undefined}
              hint={t("Home.RefreshSection.hintForSpendingSection")}
              onRefreshPress={refetch}
              hasIcon={true}
            />
          </View>
        ) : includedTopCategories && includedTopCategories.length > 0 ? (
          //I added slice(0, 3) to disply data from first three top categories only that came from api
          includedTopCategories.slice(0, 3).map(topCategoryItem => {
            const apiPercentageNumber = parseFloat(topCategoryItem.percentage.replace("%", ""));
            const formattedPercentage = `${apiPercentageNumber.toFixed(2)}%`;
            return (
              <TopCategoryItem
                testID={testID !== undefined ? `${testID}:TopCategoryItem` : undefined}
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
        ) : includedTopCategories && includedTopCategories.length === 0 ? (
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
        ) : null}
      </Stack>
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
  refreshContainerStyle: { width: "100%" },
});
