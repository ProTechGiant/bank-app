import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CreateTagModal, TagItem } from "../components";
import SelectCountryModal from "../components/SelectCountryModal";
import {
  useCreateNewTag,
  useDeleteATag,
  useGetCustomerTags,
  usePredefinedTags,
  useUpdateTags,
} from "../hooks/query-hooks";
import { createNewTag, tagIcons } from "../mocks";
import { GetCustomerSingleTagType } from "../types";

export default function SelectTagScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "TopSpending.TopSpendingStack">>();
  const transactionTags = route.params.transactionTags;
  const transactionId = route.params.transactionId;

  const [isCreateNewTagModalVisible, setIsCreateNewTagModalVisible] = useState<boolean>(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);
  const [isTripToTagModalVisible, setIsTripToTagModalVisible] = useState<boolean>(false);
  const [isDeleteNotificationModalVisible, setIsDeleteNotificationModalVisible] = useState<boolean>(false);
  const selectedDeleteTagItem = useRef<GetCustomerSingleTagType>();
  const [selectedTags, setSelectedTags] = useState<string[]>(() =>
    Array.isArray(transactionTags) ? transactionTags.map(item => item.TagId.toString()) : []
  );
  const [tripToItem, setTripToItem] = useState({ name: "", path: "" });

  const { mutateAsync: createNewTagApi } = useCreateNewTag();
  const { data: customerTransactionTags, refetch } = useGetCustomerTags();
  const { data: predefinedTags, isLoading } = usePredefinedTags();
  const updateTagsMutation = useUpdateTags();
  const { mutateAsync: deleteTagApi } = useDeleteATag();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
    marginHorizontal: theme.spacing["24p"],
  }));

  const sectionBreakerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-40"],
    height: theme.spacing["4p"],
  }));

  const flatListStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["20p"],
  }));

  const handleOnPressCreateNewTag = () => {
    setIsCreateNewTagModalVisible(true);
  };

  const handleOnPressDone = async () => {
    try {
      await updateTagsMutation.mutateAsync({
        transactionId: transactionId,
        tagsId: selectedTags.toString(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const handleOnPressTag = (id: string) => {
    if (isSelectedTag(id)) {
      setSelectedTags(selectedTags.filter(i => i !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const isSelectedTag = (id: string) => {
    return selectedTags.findIndex(i => i === id) !== -1;
  };

  const handleOnPressTripToTag = (name: string, path: string) => {
    setTripToItem({ name, path });
    setIsTripToTagModalVisible(true);
  };

  const handleSelectCountry = async (country: string) => {
    setIsTripToTagModalVisible(false);
    await createNewTagApi({
      tagName: tripToItem.name + " " + country,
      tagIcon: tripToItem.path,
      transactionId: "8",
    });
    await refetch();
  };

  const handleOnPressDelete = async () => {
    if (!selectedDeleteTagItem.current) return;
    try {
      await deleteTagApi(selectedDeleteTagItem.current.TagId);
      setIsDeleteNotificationModalVisible(false);
      refetch();
    } catch (err) {}
  };

  const handleOnCreateTag = async (selectedTagId: number, tagName: string) => {
    try {
      const response = await createNewTagApi({
        tagName,
        tagIcon: tagIcons.find(tag => tag.id === selectedTagId)?.path || "",
        //TODO: Later will give the real transaction id in the next build cycle
        transactionId: "8",
      });

      // Handling UK.TRANSACTION.TAG_ALREADY_EXISTS_FAILURE
      if (response.Status === "0011") {
        setIsNotificationModalVisible(true);
        return;
      }

      await refetch();
      setIsCreateNewTagModalVisible(false);
      return true;
    } catch (err) {}
    return false;
  };

  const navHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    zIndex: 1,
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
        <SafeAreaView edges={["top"]} style={navHeaderStyle}>
          <NavHeader variant="angled" title={t("SelectTagScreen.selectTags")} withBackButton={true} />
        </SafeAreaView>
        {isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <ScrollView style={scrollViewStyle}>
            <Stack direction="vertical" gap="20p" align="stretch" style={containerStyle}>
              <Typography.Text size="footnote" weight="regular" color="neutralBase">
                {t("SelectTagScreen.tagSubHeading")}
              </Typography.Text>
              {predefinedTags?.Tags.map(tag =>
                tag.TagId === 5 ? (
                  <TagItem
                    item={{
                      id: tag.TagId,
                      name: tag.TagName,
                      path: tag.TagIcon,
                      viewBox: "12 12 20 20",
                    }}
                    isSelected={false}
                    isSelectable={false}
                    onPress={() => handleOnPressTripToTag(tag.TagName, tag.TagIcon)}
                  />
                ) : (
                  <TagItem
                    item={{
                      id: tag.TagId,
                      name: tag.TagName,
                      path: tag.TagIcon,
                      viewBox: "12 12 20 20",
                    }}
                    isSelected={isSelectedTag(tag.TagId.toString())}
                    onPress={() => handleOnPressTag(tag.TagId.toString())}
                    isSelectable={true}
                  />
                )
              )}
            </Stack>
            <View style={sectionBreakerStyle} />
            <Stack direction="vertical" gap="20p" align="stretch" style={containerStyle}>
              <TagItem
                item={createNewTag}
                isSelected={false}
                isSelectable={false}
                onPress={handleOnPressCreateNewTag}
              />
              <FlatList
                contentContainerStyle={flatListStyle}
                data={customerTransactionTags?.Tags}
                keyExtractor={item => item.TagId.toString()}
                renderItem={({ item }: { item: GetCustomerSingleTagType }) => (
                  <TagItem
                    item={{
                      id: item.TagId,
                      name: item.TagName,
                      path: item.TagIcon,
                    }}
                    isSelected={isSelectedTag(item.TagId.toString())}
                    onPress={() => handleOnPressTag(item.TagId.toString())}
                    isSelectable={true}
                    onDeletePress={() => {
                      selectedDeleteTagItem.current = item;
                      setIsDeleteNotificationModalVisible(true);
                    }}
                  />
                )}
              />
            </Stack>
          </ScrollView>
        )}
        <View style={buttonContainerStyle}>
          <Button onPress={handleOnPressDone}>{t("SelectTagScreen.done")}</Button>
        </View>
        <Modal
          visible={isCreateNewTagModalVisible}
          onBack={() => setIsCreateNewTagModalVisible(false)}
          onClose={() => setIsCreateNewTagModalVisible(false)}
          headerText={t("SelectTagScreen.createANewTag")}>
          <CreateTagModal
            onCreatePress={handleOnCreateTag}
            isNotificationModalVisible={isNotificationModalVisible}
            onNotificationModalClose={setIsNotificationModalVisible}
          />
        </Modal>
        <NotificationModal
          title={t("SelectTagScreen.modalTitle")}
          message={t("SelectTagScreen.modalMessage")}
          variant="error"
          isVisible={isDeleteNotificationModalVisible}
          onClose={() => setIsDeleteNotificationModalVisible(false)}
          buttons={{
            primary: <Button children={t("SelectTagScreen.delete")} onPress={handleOnPressDelete} />,
            secondary: (
              <Button
                children={t("SelectTagScreen.cancel")}
                onPress={() => setIsDeleteNotificationModalVisible(false)}
              />
            ),
          }}
        />
        <Modal visible={isTripToTagModalVisible} onClose={() => setIsTripToTagModalVisible(false)}>
          <SelectCountryModal handleSelectCountry={handleSelectCountry} />
        </Modal>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
