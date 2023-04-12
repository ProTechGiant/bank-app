import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import { useThemeStyles } from "@/theme";

import { PUSH } from "../../constants";
import { useNotificationPreferencesCategory, useUpdateNotificationPreferences } from "../../query-hooks";
import { UpdatedSubCategories } from "../../types";
import SubcategorySection from "./SubcategorySection";

export default function CategoryScreen() {
  const { t } = useTranslation();

  const route = useRoute<RouteProp<MainStackParams, "NotificationManagement.CategoryScreen">>();
  const { title, categoryId } = route.params;

  const updateNotificationPreferences = useUpdateNotificationPreferences();
  const { data: subCategories } = useNotificationPreferencesCategory(categoryId);

  const mainToggleStatus = subCategories.some(
    subCategory =>
      subCategory.selectedChannels.find((channel: { channelName: string }) => channel.channelName === PUSH)?.isSelected
  );

  const handleOnMainTogglePress = () => {
    subCategories.map(subCategory => {
      subCategory.selectedChannels.map(channel => {
        if (channel.channelName === PUSH) channel.isSelected = !mainToggleStatus;
      });
      return subCategory;
    });

    callUpdateNotficationPreferences(
      subCategories.map(subCategory => {
        return {
          subCategoryId: subCategory.subCategoryId,
          selectedChannels: subCategory.selectedChannels,
        };
      })
    );
  };

  const handleOnSubTogglePress = (subCategoryId: string, value: boolean) => {
    subCategories.map(subCategory => {
      if (subCategory.subCategoryId === subCategoryId) {
        subCategory.selectedChannels.map(channel => {
          if (channel.channelName === PUSH) channel.isSelected = value;
        });
      }
      return subCategory;
    });

    callUpdateNotficationPreferences(
      subCategories
        .map(subCategory => {
          return {
            subCategoryId: subCategory.subCategoryId,
            selectedChannels: subCategory.selectedChannels,
          };
        })
        .filter(subCategory => subCategory.subCategoryId === subCategoryId)
    );
  };

  const callUpdateNotficationPreferences = async (requestBody: UpdatedSubCategories[]) => {
    try {
      await updateNotificationPreferences.mutateAsync(requestBody);
    } catch (error) {
      Alert.alert(t("NotificationManagement.CategoryScreen.alertUpdateError"));
      warn("PATCH", "Could not update notification preferences", JSON.stringify(error));
    }
  };

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
  }));
  const subtitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["24p"],
  }));

  return (
    <Page>
      <NavHeader />
      <ContentContainer isScrollView>
        <View>
          <Stack direction="horizontal" align="center" justify="space-between" style={titleContainerStyle}>
            <Typography.Text weight="semiBold" size="title1">
              {title}
            </Typography.Text>
            <Toggle onPress={handleOnMainTogglePress} value={mainToggleStatus} />
          </Stack>
          <Typography.Text weight="regular" size="callout" style={subtitleContainerStyle}>
            {t("NotificationManagement.CategoryScreen.subtitle")}
          </Typography.Text>
          <Stack direction="vertical" align="stretch">
            {subCategories.map(subCategory => {
              return (
                <View key={subCategory.subCategoryId}>
                  <SubcategorySection
                    title={subCategory.subCategoryName}
                    content={subCategory.subCategoryDescription}
                    toggleStatus={
                      subCategory.selectedChannels.find(channel => channel.channelName === PUSH)?.isSelected || false
                    }
                    onToggle={handleOnSubTogglePress.bind(null, subCategory.subCategoryId)}
                  />
                </View>
              );
            })}
          </Stack>
        </View>
      </ContentContainer>
    </Page>
  );
}
