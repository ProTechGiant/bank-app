import { RouteProp, useRoute } from "@react-navigation/native";
import { toString } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { CloseIcon, SearchIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { IconContainer } from "../components";
import { usePredefinedCategories, useUpdateCategory } from "../hooks/query-hooks";

export default function CategoriesListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { categories } = usePredefinedCategories();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "ViewTransactions.CategoriesListScreen">>();

  const { categoryId, data, cardId, createDisputeUserId } = route.params;

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId && categories) {
      const matchingCategory = categories.categories.find(category => toString(category.categoryId) === categoryId);
      if (matchingCategory) {
        setSelectedCategory(matchingCategory.categoryName);
      }
    }
  }, [categoryId, categories]);

  const [updatedCategoryId, setUpdatedCategoryId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const updateCategoryMutation = useUpdateCategory();

  const handleUpdateCategory = async () => {
    const transactionIds = data.transactionId;
    const newCategoryId = updatedCategoryId;
    const merchantName = encodeURIComponent(data.title);
    const oldCategoryId = data.categoryId;
    const newCategoryName = selectedCategory;

    try {
      const response = await updateCategoryMutation.mutateAsync({
        transactionIds,
        newCategoryId,
        merchantName,
        oldCategoryId,
      });

      const updatedData = { ...data, categoryId: newCategoryId, categoryName: newCategoryName };

      navigation.navigate("ViewTransactions.SingleTransactionDetailedScreen", {
        data: updatedData,
        cardId,
        createDisputeUserId,
        mutationStatus: "success",
        similarTransactions: response.similarTransactions?.Transaction,
      });
    } catch (error) {
      navigation.navigate("ViewTransactions.SingleTransactionDetailedScreen", {
        data: data,
        cardId,
        createDisputeUserId,
        mutationStatus: "error",
      });
    }
  };

  const filteredCategories =
    categories?.categories.filter(category =>
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const searchContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-40"],
      paddingHorizontal: theme.spacing["20p"],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: theme.radii.small,
      borderWidth: isFocused ? 1 : 0,
      borderColor: isFocused ? theme.palette.primaryBase : "transparent",
      marginTop: theme.spacing["16p"],
    }),
    [isFocused]
  );

  const searchInputStyle = useThemeStyles<TextStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const iconListStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const notFoundContainer = useThemeStyles<TextStyle>(theme => ({
    flex: 1,
    alignItems: "center",
    marginTop: theme.spacing["20p"],
  }));

  const searchIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-10"]);

  const contentStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["32p"],
    marginTop: theme.spacing["16p"],
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <NavHeader
        variant="angled"
        onBackPress={handleOnBackPress}
        title={t("ViewTransactions.CategoriesListScreen.title")}
      />
      <View style={contentStyle}>
        <View style={searchContainerStyle}>
          <View style={styles.searchTextContainer}>
            <SearchIcon color={searchIconColor} />
            <TextInput
              style={searchInputStyle}
              placeholder={t("ViewTransactions.CategoriesListScreen.searchByCategory")}
              onChangeText={text => setSearchQuery(text)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={searchQuery}
            />
          </View>
          {searchQuery ? (
            <Pressable
              onPress={() => {
                setSearchQuery("");
              }}>
              <CloseIcon color={searchIconColor} />
            </Pressable>
          ) : null}
        </View>
        {filteredCategories.length > 0 ? (
          <FlatList
            style={iconListStyle}
            data={filteredCategories}
            renderItem={({ item }) => (
              <IconContainer
                name={item.categoryName}
                path={item.iconPath?.replace('d="', "").replace('"', "")}
                viewBox={item.iconViewBox}
                selected={selectedCategory === item.categoryName}
                onPress={() => {
                  setSelectedCategory(item.categoryName);
                  setUpdatedCategoryId(toString(item.categoryId));
                }}
              />
            )}
            keyExtractor={item => toString(item.categoryId)}
            numColumns={3}
          />
        ) : (
          <View style={notFoundContainer}>
            <Typography.Text size="footnote" weight="regular">
              {t("ViewTransactions.SingleTransactionDetailedScreen.emptyCategory")}
            </Typography.Text>
          </View>
        )}
        <View>
          <Button onPress={handleUpdateCategory}>{t("ViewTransactions.CategoriesListScreen.title")}</Button>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  searchTextContainer: { alignItems: "center", flexDirection: "row" },
});
