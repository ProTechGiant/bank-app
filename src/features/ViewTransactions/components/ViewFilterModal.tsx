import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { CheckIcon, ChevronRightIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Button from "@/components/Button";
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
    backgroundColor: theme.palette["neutralBase-60"],
    justifyContent: "center",
    alignItems: "center",
  }));

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-50"],
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
    padding: theme.spacing["16p"],
    flexDirection: "column",
    justifyContent: "center",
    width: 370,
    height: 70,
    borderRadius: theme.radii.extraSmall,
  }));

  const margins = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const filterOption = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["16p"],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 350,
    height: 64,
    backgroundColor: theme.palette.transparent,
    marginVertical: theme.spacing["4p"],
    borderRadius: theme.radii.small,
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
  const categoriesChevronColor = useThemeStyles<string>(theme => theme.palette["neutralBase+10"]);

  const selectedOption = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  const filterButton = useThemeStyles<ViewStyle>(
    theme => ({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing["16p"],
      width: "100%",
      height: 56,
      borderRadius: theme.radii.extraSmall,
      backgroundColor: !(selectedSpendingCategories.length > 0 || selectedCardTypes.length > 0)
        ? theme.palette["neutralBase-40"]
        : theme.palette.primaryBase,
    }),
    [selectedSpendingCategories, selectedCardTypes]
  );

  const goBackTo = (screen: ModalScreens) => {
    handleFilterOptionChange(screen, t("ViewTransactions.TransactionsScreen.filterOptions"));
  };

  const renderMainScreen = () => {
    return (
      <>
        <View style={centerCont}>
          <View style={margins}>
            <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
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
            </WithShadow>
          </View>
          <View style={margins}>
            <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
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
            </WithShadow>
          </View>
        </View>

        <View>
          <Pressable
            onPress={handleApplyFilter}
            disabled={!(selectedSpendingCategories.length > 0 || selectedCardTypes.length > 0)}
            style={filterButton}>
            <Typography.Text
              color={
                !(selectedSpendingCategories.length > 0 || selectedCardTypes.length > 0)
                  ? "neutralBase-20"
                  : "neutralBase-60"
              }
              size="body"
              weight="medium">
              {t("ViewTransactions.TransactionsScreen.applyFilter")}
            </Typography.Text>
          </Pressable>
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
      <Pressable
        style={[filterOption, selectedSpendingCategories.includes(categoryId) ? selectedOption : null]}
        onPress={() => handleSelectSpendingCategory(categoryId)}>
        <Typography.Text
          color={selectedSpendingCategories.includes(categoryId) ? "neutralBase+10" : color}
          size="callout"
          weight="medium">
          {categoryName}
        </Typography.Text>
        {selectedSpendingCategories.includes(categoryId) ? <CheckIcon color={categoriesChevronColor} /> : null}
      </Pressable>
    );
  };

  const renderBySpendingCategoryScreen = () => {
    return (
      <View style={centerCont}>
        {categories ? (
          categories.categories.map(category =>
            renderCategoryPressable({
              categoryId: category.categoryId.toString(),
              categoryName: category.categoryName,
              color: "primaryBase",
            })
          )
        ) : (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>
    );
  };

  const renderByCardTypeScreen = () => {
    return (
      <View style={centerCont}>
        <Pressable
          style={[filterOption, selectedCardTypes[0] === "SINGLE_USE_CARD_TR" ? selectedOption : null]}
          onPress={() => handleSelectCardType(["SINGLE_USE_CARD_TR"])}>
          <Typography.Text
            color={selectedCardTypes[0] === "SINGLE_USE_CARD_TR" ? "neutralBase+10" : "primaryBase"}
            size="callout"
            weight="medium">
            {t("ViewTransactions.FilterOptionsModal.CardTypes.OneTimeCard")}
          </Typography.Text>
          {selectedCardTypes[0] === "SINGLE_USE_CARD_TR" ? <CheckIcon /> : null}
        </Pressable>
        <Pressable
          style={[filterOption, selectedCardTypes[0] === "DEBIT_TR" ? selectedOption : null]}
          onPress={() => handleSelectCardType(["DEBIT_TR"])}>
          <Typography.Text
            color={selectedCardTypes[0] === "DEBIT_TR" ? "neutralBase+10" : "primaryBase"}
            size="callout"
            weight="medium">
            {t("ViewTransactions.FilterOptionsModal.CardTypes.DebitCard")}
          </Typography.Text>
          {selectedCardTypes[0] === "DEBIT_TR" ? <CheckIcon /> : null}
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
