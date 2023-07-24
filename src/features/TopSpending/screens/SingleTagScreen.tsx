import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useTransactions from "@/hooks/use-not-pending-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  CheckBoxCell,
  ChoosenCategories,
  TagChart,
  TagHeader,
  TransactionCell,
  TransactionTitleAndCounter,
} from "../components";
import { usePreDefinedCategories } from "../hooks/query-hooks";
import { TopSpendingStackParams } from "../TopSpendingStack";

interface CategoryType {
  categoryId: number;
  categoryName: string;
  iconPath: string;
}

export default function SingleTagScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<TopSpendingStackParams, "TopSpending.SingleTagScreen">>();
  const data = route.params.data;

  const { t } = useTranslation();

  const { categories, isLoading } = usePreDefinedCategories();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [choosenCategories, setChoosenCategories] = useState<CategoryType[]>([]);

  const { notPendingTransactions } = useTransactions(
    undefined,
    choosenCategories ? choosenCategories.map(obj => obj.categoryId).join(",") : undefined,
    data.TagId
  );

  const handleOnCloseModal = () => {
    setChoosenCategories([]);
    setIsModalVisible(!isModalVisible);
  };

  const handleOnToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOnOpenModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOnUpdateCategories = (category: CategoryType, isChecked: boolean) => {
    if (isChecked) {
      setChoosenCategories(prevCategories =>
        prevCategories.filter(chosenCategory => chosenCategory.categoryId !== category.categoryId)
      );
    } else {
      setChoosenCategories(prevCategories => [...prevCategories, category]);
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    setChoosenCategories(prevCategories => prevCategories.filter(category => category.categoryId !== categoryId));
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const marginsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const controlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const setButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.xlarge,
  }));
  const resetStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    alignItems: "center",
  }));

  return (
    <Page backgroundColor="neutralBase-40">
      <NavHeader variant="background" onBackPress={handleOnBackPress} />
      <TagHeader TotalAmount={notPendingTransactions.data?.TotalAmount ?? 0} />
      <TagChart data={data} TotalAmount={notPendingTransactions.data?.TotalAmount ?? 0} />
      <ContentContainer isScrollView>
        <TransactionTitleAndCounter handleOnOpenModal={handleOnOpenModal} counter={Number(choosenCategories.length)} />
        <ChoosenCategories categories={choosenCategories} handleRemoveCategory={handleRemoveCategory} />
        <View style={marginsStyle}>
          <FlatList
            data={notPendingTransactions.data?.Transaction ?? []}
            renderItem={({ item }) => <TransactionCell transaction={item} />}
            keyExtractor={item => item.TransactionId.toString()}
          />
        </View>
        <Modal style={styles.modal} onClose={handleOnCloseModal} visible={isModalVisible} headerText="Filter">
          <View>
            <Typography.Text size="callout" color="neutralBase+30" weight="medium">
              {t("TopSpending.SingleTagScreen.Modal.category")}:
            </Typography.Text>

            {!isLoading ? (
              <View style={styles.checkbox}>
                <View>
                  <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                      <CheckBoxCell
                        category={item}
                        choosenCategories={choosenCategories}
                        handleOnUpdateCategories={handleOnUpdateCategories}
                      />
                    )}
                    keyExtractor={item => item.categoryId.toString()}
                  />
                </View>
              </View>
            ) : (
              <FlexActivityIndicator />
            )}

            <View style={controlStyle}>
              <TouchableOpacity onPress={handleOnToggleModal} style={setButtonStyle}>
                <Typography.Text color="neutralBase-60" weight="medium" size="body">
                  {t("TopSpending.SingleTagScreen.Modal.set")}
                </Typography.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={resetStyle}
                onPress={() => {
                  setIsModalVisible(false);
                  setChoosenCategories([]);
                }}>
                <Typography.Text color="primaryBase" weight="medium" size="body">
                  {t("TopSpending.SingleTagScreen.Modal.reset")}
                </Typography.Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    height: "75%",
  },
  modal: {
    height: "90%",
  },
});
