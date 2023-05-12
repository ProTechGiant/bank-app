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

import { SubcategorySection } from "../components";
import { PUSH } from "../constants";
import { useNotificationPreferencesCategory, useUpdateNotificationPreferences } from "../query-hooks";
import { UpdatedSubCategories } from "../types";

export default function CategoryScreen() {
  const { t } = useTranslation();

  const route = useRoute<RouteProp<MainStackParams, "NotificationManagement.CategoryScreen">>();
  const { title, categoryId } = route.params;

  const updateNotificationPreferences = useUpdateNotificationPreferences();
  const { data: subCategories } = useNotificationPreferencesCategory(categoryId);

  const mainToggleStatus = subCategories.some(
    subCategory =>
      subCategory.SelectedChannels.find((channel: { ChannelName: string }) => channel.ChannelName === PUSH)?.IsSelected
  );

  const handleOnMainTogglePress = () => {
    subCategories.map(subCategory => {
      subCategory.SelectedChannels.map(channel => {
        if (channel.ChannelName === PUSH) channel.IsSelected = !mainToggleStatus;
      });
      return subCategory;
    });

    callUpdateNotficationPreferences(
      subCategories.map(subCategory => {
        return {
          SubCategoryId: subCategory.SubCategoryId,
          SelectedChannels: subCategory.SelectedChannels,
        };
      })
    );
  };

  const handleOnSubTogglePress = (subCategoryId: string, value: boolean) => {
    subCategories.map(subCategory => {
      if (subCategory.SubCategoryId === subCategoryId) {
        subCategory.SelectedChannels.map(channel => {
          if (channel.ChannelName === PUSH) channel.IsSelected = value;
        });
      }
      return subCategory;
    });

    callUpdateNotficationPreferences(
      subCategories
        .map(subCategory => {
          return {
            SubCategoryId: subCategory.SubCategoryId,
            SelectedChannels: subCategory.SelectedChannels,
          };
        })
        .filter(subCategory => subCategory.SubCategoryId === subCategoryId)
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
