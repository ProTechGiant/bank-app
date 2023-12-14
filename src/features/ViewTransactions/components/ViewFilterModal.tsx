import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import { usePredefinedCategories } from "../hooks/query-hooks";

interface ViewFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: string[]) => void;
  selectedFilters: string[];
}

interface RenderCategoryPressableProps {
  categoryId: string;
  categoryName: string;
  color: keyof Theme["palette"];
}

enum ModalScreens {
  Main,
  BySpendingCategory,
  ByCardType,
}

export default function ViewFilterModal({ visible, onClose, onApplyFilter, selectedFilters }: ViewFilterModalProps) {
  const { t } = useTranslation();

  const { categories } = usePredefinedCategories();

  const centerCont = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.transparent,
    paddingBottom: theme.spacing["16p"],
  }));

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-50"],
    maxHeight: "90%",
  }));

  const [currentScreen, setCurrentScreen] = useState(ModalScreens.Main);
  const [headerText, setHeaderText] = useState(t("ViewTransactions.TransactionsScreen.filterOptions"));
  const [selectedSpendingCategories, setSelectedSpendingCategories] = useState<string[]>([]);
  const [selectedCardTypes, setSelectedCardTypes] = useState<string[]>([]);

  const handleFilterOptionChange = (screen: ModalScreens, textHeader: string) => {
    setCurrentScreen(screen);
    setHeaderText(textHeader);
  };

  const handleSelectSpendingCategory = (selectedCategory: string) => {
    if (selectedSpendingCategories.includes(selectedCategory)) {
      setSelectedSpendingCategories(selectedSpendingCategories.filter(category => category !== selectedCategory));
    } else {
      setSelectedSpendingCategories([...selectedSpendingCategories, selectedCategory]);
    }
  };

  useEffect(() => {
    if (selectedFilters) {
      const spendingCategories = selectedFilters.filter(
        (filter: string) => filter !== "SINGLE_USE_CARD_TR" && filter !== "DEBIT_TR"
      );
      setSelectedSpendingCategories(spendingCategories);

      const cardTypes = selectedFilters.filter(
        (filter: string) => filter === "SINGLE_USE_CARD_TR" || filter === "DEBIT_TR"
      );
      setSelectedCardTypes(cardTypes);
    }
  }, [selectedFilters]);

  const handleSelectCardType = (selectedType: [string]) => {
    setSelectedCardTypes(selectedType);
  };

  const handleApplyFilter = () => {
    const filters = [...selectedSpendingCategories];
    if (selectedCardTypes[0] !== undefined) {
      filters.push(selectedCardTypes[0]);
    }
    onApplyFilter(filters);
    onClose();
  };

  const handleOnClearFilter = () => {
    setSelectedSpendingCategories([]);
    setSelectedCardTypes([]);
    onApplyFilter([]);
  };

  const filterContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    padding: theme.spacing["8p"],
    flexDirection: "column",
    justifyContent: "center",
    height: 70,
    borderRadius: theme.radii.extraSmall,
  }));

  const margins = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
  }));

  const filterOption = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const selectedFilter = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    color: theme.palette.primaryBase,
  }));

  const optionContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
  }));

  const chevronColor = useThemeStyles<string>(theme => theme.palette.primaryBase);

  const goBackTo = (screen: ModalScreens) => {
    handleFilterOptionChange(screen, t("ViewTransactions.TransactionsScreen.filterOptions"));
  };

  const renderMainScreen = () => {
    return (
      <>
        <View style={centerCont}>
          <View style={margins}>
            <Pressable
              style={filterContainer}
              onPress={() =>
                handleFilterOptionChange(
                  ModalScreens.BySpendingCategory,
                  t("ViewTransactions.TransactionsScreen.bySpending")
                )
              }>
              <View style={styles.alignOption}>
                <Typography.Text color="primaryBase" size="callout" weight="medium">
                  {t("ViewTransactions.TransactionsScreen.bySpending")}
                </Typography.Text>
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ChevronRightIcon color={palette.primaryBase} />
                </View>
              </View>
              <View style={selectedFilter}>
                {selectedSpendingCategories.map(categoryId => {
                  const selectedCategory = categories?.categories.find(
                    category => category.categoryId.toString() === categoryId
                  );
                  if (selectedCategory) {
                    return (
                      <View style={optionContainer} key={categoryId}>
                        <Text style={selectedFilter}>{selectedCategory.categoryName}</Text>
                      </View>
                    );
                  } else {
                    return null;
                  }
                })}
              </View>
            </Pressable>
          </View>
          <View style={margins}>
            <Pressable
              style={filterContainer}
              onPress={() =>
                handleFilterOptionChange(ModalScreens.ByCardType, t("ViewTransactions.TransactionsScreen.byCard"))
              }>
              <View style={styles.alignOption}>
                <Typography.Text color="primaryBase" size="callout" weight="medium">
                  {t("ViewTransactions.TransactionsScreen.byCard")}
                </Typography.Text>
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ChevronRightIcon color={chevronColor} />
                </View>
              </View>
              <View style={selectedFilter}>
                {selectedCardTypes.map(type => (
                  <View style={optionContainer} key={type}>
                    <Text style={selectedFilter}>
                      {type === "SINGLE_USE_CARD_TR"
                        ? t("ViewTransactions.FilterOptionsModal.CardTypes.OneTimeCard")
                        : t("ViewTransactions.FilterOptionsModal.CardTypes.DebitCard")}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          </View>
        </View>
        <View>
          <Button
            disabled={!(selectedSpendingCategories.length > 0 || selectedCardTypes.length > 0)}
            onPress={handleApplyFilter}>
            {t("ViewTransactions.TransactionsScreen.applyFilter")}
          </Button>
        </View>
        <Button
          disabled={!(selectedSpendingCategories.length > 0 || selectedCardTypes.length > 0)}
          variant="tertiary"
          onPress={handleOnClearFilter}>
          {t("ViewTransactions.TransactionsScreen.clearAll")}
        </Button>
      </>
    );
  };

  const renderCategoryPressable = ({ categoryId, categoryName, color }: RenderCategoryPressableProps) => {
    return (
      <Pressable onPress={() => handleSelectSpendingCategory(categoryId)}>
        <Stack direction="horizontal" style={filterOption} align="stretch" justify="space-between">
          <Typography.Text color={color} size="callout" weight="medium">
            {categoryName}
          </Typography.Text>
          <CheckboxInput value={selectedSpendingCategories.includes(categoryId)} />
        </Stack>
      </Pressable>
    );
  };

  const renderBySpendingCategoryScreen = () => {
    return (
      <ScrollView contentContainerStyle={centerCont}>
        {categories ? (
          <ScrollView style={{ height: "88%" }}>
            {categories?.categories.map(category =>
              renderCategoryPressable({
                categoryId: category.categoryId.toString(),
                categoryName: category.categoryName,
                color: "primaryBase",
              })
            )}
          </ScrollView>
        ) : (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </ScrollView>
    );
  };

  const renderByCardTypeScreen = () => {
    return (
      <View style={centerCont}>
        <Pressable onPress={() => handleSelectCardType(["SINGLE_USE_CARD_TR"])}>
          <Stack direction="horizontal" style={filterOption} align="stretch" justify="space-between">
            <Typography.Text color="primaryBase" size="callout" weight="medium">
              {t("ViewTransactions.FilterOptionsModal.CardTypes.OneTimeCard")}
            </Typography.Text>
            <CheckboxInput value={selectedCardTypes[0] === "SINGLE_USE_CARD_TR"} />
          </Stack>
        </Pressable>
        <Pressable onPress={() => handleSelectCardType(["DEBIT_TR"])}>
          <Stack direction="horizontal" style={filterOption} align="stretch" justify="space-between">
            <Typography.Text color="primaryBase" size="callout" weight="medium">
              {t("ViewTransactions.FilterOptionsModal.CardTypes.DebitCard")}
            </Typography.Text>
            <CheckboxInput value={selectedCardTypes[0] === "DEBIT_TR"} />
          </Stack>
        </Pressable>
      </View>
    );
  };

  return (
    <Modal
      onBack={
        currentScreen !== ModalScreens.Main
          ? () => handleFilterOptionChange(ModalScreens.Main, t("ViewTransactions.TransactionsScreen.filterOptions"))
          : undefined
      }
      visible={visible}
      onClose={currentScreen !== ModalScreens.Main ? () => goBackTo(ModalScreens.Main) : onClose}
      style={modalStyle}
      headerText={headerText}>
      {currentScreen === ModalScreens.Main
        ? renderMainScreen()
        : currentScreen === ModalScreens.BySpendingCategory
        ? renderBySpendingCategoryScreen()
        : currentScreen === ModalScreens.ByCardType
        ? renderByCardTypeScreen()
        : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  alignOption: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
