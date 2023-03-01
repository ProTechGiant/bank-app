import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
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

export default function SubcategoryScreen() {
  const route = useRoute<RouteProp<MainStackParams, "NotificationManagement.SubcategoryScreen">>();
  const { data, title } = route.params;

  const { t } = useTranslation();

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
  }));

  const subtitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["24p"],
  }));

  const [toggleStatus, setToggleStatus] = useState(false);

  //Temporary code to set default status, to be replaced later during service integration
  useEffect(() => {
    title.toLocaleLowerCase() === "transfers" ? setToggleStatus(true) : setToggleStatus(false);
  }, []);

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
              <Toggle onPress={() => setToggleStatus(!toggleStatus)} value={toggleStatus} />
            </Stack>
            <Typography.Text weight="regular" size="callout" style={subtitleContainerStyle}>
              {t("NotificationManagement.SubcategoryScreen.subtitle")}
            </Typography.Text>
            <Stack direction="vertical" align="stretch">
              {data.map(subcategory => {
                return (
                  <View key={subcategory?.subCategoryId}>
                    <SubcategorySection
                      title={subcategory?.subCategoryName}
                      content={subcategory?.subCategoryDescription}
                      mainToggleStatus={toggleStatus}
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
