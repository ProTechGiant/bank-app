import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import { useThemeStyles } from "@/theme";

import SubcategorySection from "./SubcategorySection";

export default function CategoryScreen() {
  const route = useRoute<RouteProp<MainStackParams, "NotificationManagement.CategoryScreen">>();
  const { subCategories, title } = route.params;

  const { t } = useTranslation();

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
  }));

  const subtitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["24p"],
  }));

  //Temp status initialization, later status should be initialized depending on how service responds
  const [mainToggleStatus, setMainToggleStatus] = useState(
    subCategories.some(subCategory => subCategory.currentStatus)
  );
  const [subCategoriesData, setSubCategoriesData] = useState(subCategories);

  const handleOnMainTogglePress = () => {
    setMainToggleStatus(!mainToggleStatus);
    setSubCategoriesData(currentData =>
      currentData.map(subCategory => {
        subCategory.currentStatus = !mainToggleStatus;
        return subCategory;
      })
    );
    //Call service to update categories data
  };

  const handleOnSubTogglePress = (subCategoryId: string, value: boolean) => {
    setMainToggleStatus(
      value ||
        subCategoriesData
          .filter(subCategory => subCategory.subCategoryId !== subCategoryId)
          .some(subCategory => subCategory.currentStatus)
    );
    setSubCategoriesData(currentData =>
      currentData.map(subCategory => {
        if (subCategory?.subCategoryId === subCategoryId) {
          subCategory.currentStatus = value;
        }
        return subCategory;
      })
    );
    //Call service to update categories data
  };

  return (
    <>
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
              {subCategoriesData.map(subCategory => {
                return (
                  <View key={subCategory?.subCategoryId}>
                    <SubcategorySection
                      title={subCategory?.subCategoryName}
                      content={subCategory?.subCategoryDescription}
                      toggleStatus={subCategory?.currentStatus}
                      onToggle={handleOnSubTogglePress.bind(null, subCategory.subCategoryId)}
                    />
                  </View>
                );
              })}
            </Stack>
          </View>
        </ContentContainer>
      </Page>
    </>
  );
}
