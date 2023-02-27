import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { InfoCircleIcon, ReferralIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { mockNotificationManagementCategories } from "@/mocks/notificationManagementCategories";
import { useThemeStyles } from "@/theme";

import Section from "./Section";

export default function HubScreen() {
  const { t } = useTranslation();

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const infoIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
  }));

  const subtitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["24p"],
  }));

  const categoriesContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  const infoIconDimensions = useThemeStyles(theme => theme.iconDimensions.globe);
  const notificationIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.faqSectionIcons);

  const infoIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-10"]);

  return (
    <Page>
      <ScrollView>
        <NavHeader />
        <View style={contentContainerStyle}>
          <Stack direction="horizontal" align="center" style={titleContainerStyle}>
            <Typography.Text weight="semiBold" size="title1">
              {t("NotificationManagement.HubScreen.title")}
            </Typography.Text>
            <Pressable style={infoIconContainer}>
              <InfoCircleIcon height={infoIconDimensions} width={infoIconDimensions} color={infoIconColor} />
            </Pressable>
          </Stack>
          <Typography.Text weight="regular" size="callout" style={subtitleContainerStyle}>
            {t("NotificationManagement.HubScreen.subtitle")}
          </Typography.Text>
          <Stack direction="vertical" align="stretch">
            {mockNotificationManagementCategories.categories.map(data => {
              return (
                <View style={categoriesContainerStyle} key={data.categoryId}>
                  <Section
                    title={data.categoryName}
                    content={data.categoryDescription}
                    icon={<ReferralIcon height={notificationIconDimensions} width={notificationIconDimensions} />}
                  />
                </View>
              );
            })}
          </Stack>
        </View>
      </ScrollView>
    </Page>
  );
}
