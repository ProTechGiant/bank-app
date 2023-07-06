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
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import { SubcategorySection } from "../components";
import { PUSH } from "../constants";
import { useNotificationPreferencesCategory, useUpdateNotificationPreferences } from "../query-hooks";
import { UpdatedSubCategories } from "../types";

export default function CategoryScreen() {
  const { t } = useTranslation();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "NotificationManagement.CategoryScreen">>();
  const { title, categoryId } = route.params;

  const updateNotificationPreferences = useUpdateNotificationPreferences();
  const { data: subCategories } = useNotificationPreferencesCategory(categoryId);

  const mainToggleStatus = subCategories.some(
    subCategory => subCategory.SelectedChannels.find(channel => channel.ChannelName === PUSH)?.IsSelected
  );

  const handleOnMainTogglePress = () => {
    const updatedValue = subCategories.map(subCategory => {
      return {
        ...subCategory,
        SelectedChannels: subCategory.SelectedChannels.map(channel => ({
          ...channel,
          isSelected: channel.ChannelName === PUSH ? !mainToggleStatus : channel.IsSelected,
        })),
      };
    });

    callUpdateNotficationPreferences(
      updatedValue.map(subCategory => ({
        SubCategoryId: subCategory.SubCategoryId,
        SelectedChannels: subCategory.SelectedChannels,
      }))
    );
  };

  const handleOnSubTogglePress = (subCategoryId: string, value: boolean) => {
    const updatedValue = subCategories.map(subCategory => {
      if (subCategory.SubCategoryId !== subCategoryId) {
        return subCategory;
      }

      return {
        ...subCategory,
        SelectedChannels: subCategory.SelectedChannels.map(channel => {
          return { ...channel, IsSelected: channel.ChannelName === PUSH ? value : channel.IsSelected };
        }),
      };
    });

    callUpdateNotficationPreferences(
      updatedValue
        .filter(subCategory => subCategory.SubCategoryId === subCategoryId)
        .map(subCategory => ({
          SubCategoryId: subCategory.SubCategoryId,
          SelectedChannels: subCategory.SelectedChannels,
        }))
    );
  };

  const callUpdateNotficationPreferences = async (requestBody: UpdatedSubCategories[]) => {
    try {
      await updateNotificationPreferences.mutateAsync(requestBody);
    } catch (error) {
      Alert.alert(t("NotificationManagement.CategoryScreen.alertUpdateError"));
      warn("notification-management", "Could not update notification preferences", JSON.stringify(error));
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
    <Page backgroundColor="neutralBase-60">
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
                <View key={subCategory.SubCategoryId}>
                  <SubcategorySection
                    title={subCategory.SubCategoryName}
                    content={subCategory.SubCategoryDescription}
                    toggleStatus={
                      subCategory.SelectedChannels.find(channel => channel.ChannelName === PUSH)?.IsSelected || false
                    }
                    onToggle={handleOnSubTogglePress.bind(null, subCategory.SubCategoryId)}
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
