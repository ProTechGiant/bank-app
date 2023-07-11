import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CreateTagModal, TagItem } from "../components";
import { useCreateNewTag, useGetCustomerTags } from "../hooks/query-hooks";
import { createNewTag, predefinedTags, tagIcons, tripToItem } from "../mocks/MockData";
import { GetCustomerSingleTagType } from "../types";

export default function SelectTagScreen() {
  const { t } = useTranslation();

  const [isCreateNewTagModalVisible, setIsCreateNewTagModalVisible] = useState<boolean>(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);

  const { mutateAsync: createNewTagApi } = useCreateNewTag();
  const { data: customerTransactionTags, refetch } = useGetCustomerTags("2021-12-12", "2023-12-12");

  const navigation = useNavigation();
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["28p"],
    paddingBottom: theme.spacing["20p"],
    marginHorizontal: theme.spacing["24p"],
  }));

  const sectionBreakerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing.full,
    backgroundColor: theme.palette["neutralBase-40"],
    height: theme.spacing["4p"],
  }));

  const flatListStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["20p"],
  }));

  const handleOnPressCreateNewTag = () => {
    setIsCreateNewTagModalVisible(true);
  };

  const handleOnPressDone = () => {
    navigation.goBack();
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

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("SelectTagScreen.selectTags")} withBackButton={true} />
        <ScrollView style={scrollViewStyle}>
          <Stack direction="vertical" gap="20p" align="stretch" style={containerStyle}>
            <Typography.Text size="footnote" weight="regular" color="neutralBase">
              {t("SelectTagScreen.tagSubHeading")}
            </Typography.Text>
            {predefinedTags.map(tag => (
              <TagItem item={tag} isTag={true} />
            ))}
            <TagItem item={tripToItem} isTag={false} />
          </Stack>
          <View style={sectionBreakerStyle} />
          <Stack direction="vertical" gap="20p" align="stretch" style={containerStyle}>
            <TagItem item={createNewTag} isTag={false} onPress={handleOnPressCreateNewTag} />
            <FlatList
              contentContainerStyle={flatListStyle}
              data={customerTransactionTags?.Tags}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }: { item: GetCustomerSingleTagType; index: number }) => (
                <TagItem
                  item={{
                    id: index,
                    name: item.TagName,
                    path: item.TagIcon,
                  }}
                  isTag={true}
                />
              )}
            />
          </Stack>
        </ScrollView>
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
      </Page>
    </SafeAreaProvider>
  );
}
