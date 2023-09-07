import { format, formatDistance, isToday, isYesterday, startOfToday } from "date-fns";
import { createElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { ChatIcon, InfoCircleIcon, SwapIcon } from "@/assets/icons";
import DefaultContent from "@/components/DefaultContent";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { LoadMoreIcon } from "../assets/LoadMoreIcon";
import noNotificationImage from "../assets/no-notifications-image.png";
import { NotificationItem } from "../components";
import { Notifications } from "../mock";
import { NotificationType, PAGE_SIZE, SectionEnum } from "../types";

export default function NotificationsHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const todayDate = startOfToday();

  // const [isFiltersModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationType<Date>[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  //TODO-REMOVE Mock till api works
  const refetch = () => {
    //TODO refetch logic
  };
  const isError = false;
  const isFetching = false;
  const data = Notifications;
  //TODO-Call const { data, isError, isLoading, refetch } = useAllNotifications(10, 0, new Date(), new Date());

  const todaySection = {
    day: SectionEnum.TODAY,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.TODAY}`),
    data: notifications.filter(object => isToday(object.CreatedOn)),
  };
  const yesterdaySection = {
    day: SectionEnum.YESTERDAY,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.YESTERDAY}`),
    data: notifications.filter(notification => isYesterday(notification.CreatedOn)),
  };
  const olderSection = {
    day: SectionEnum.OLDER,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.OLDER}`),
    data: notifications.filter(
      notification => !isToday(notification.CreatedOn) && !isYesterday(notification.CreatedOn)
    ),
  };

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  useEffect(() => {
    setNotifications(notification => [...notification, ...data]);
    if (data?.length < PAGE_SIZE) setIsAllDataLoaded(true);
  }, [data]);

  const loadMoreDate = () => {
    if (!isAllDataLoaded) {
      setPageNumber(pageNumber + 1);
      //TODO call api to get more data
    }
  };

  const handleOnExploreMorePress = () => {
    navigation.navigate("WhatsNext.WhatsNextStack", { screen: "WhatsNext.HubScreen" });
  };

  const handleOnFilterIconPress = () => {
    //setIsFiltersModalVisible(true)
  };

  const sectionsStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["8p"],
    marginTop: theme.spacing["20p"],
    padding: theme.spacing["12p"],
  }));

  const sectionTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
  }));

  const loadMoreButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    paddingVertical: theme.spacing["20p"],
    gap: theme.spacing["4p"],
    flexDirection: "row",
  }));

  return (
    <Page insets={["left"]}>
      {isFetching ? (
        <FlexActivityIndicator />
      ) : (
        <>
          <NavHeader
            variant="angled"
            title={t("Notifications.NotificationHubScreen.title")}
            end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={handleOnFilterIconPress} />}
          />
          {notifications !== undefined &&
            (notifications.length === 0 ? (
              <DefaultContent
                title={t("Notifications.NotificationHubScreen.emptyPage.title")}
                subtitle={t("Notifications.NotificationHubScreen.emptyPage.subtitle")}
                image={noNotificationImage}
                buttonText={t("Notifications.NotificationHubScreen.emptyPage.buttonText")}
                onButtonPress={handleOnExploreMorePress}
              />
            ) : (
              <SectionList
                pagingEnabled={true}
                style={sectionsStyle}
                data={data}
                sections={[todaySection, yesterdaySection, olderSection]}
                renderSectionHeader={({ section }) => (
                  <Typography.Text weight="medium" size="callout" color="neutralBase-10" style={sectionTitleStyle}>
                    {section.title}
                  </Typography.Text>
                )}
                ListFooterComponent={
                  !isAllDataLoaded ? (
                    <View style={loadMoreButtonStyle}>
                      <LoadMoreIcon />
                      <Typography.Text size="caption1" color="neutralBase">
                        {t("Notifications.NotificationHubScreen.loadMore")}
                      </Typography.Text>
                    </View>
                  ) : null
                }
                onEndReached={loadMoreDate}
                renderItem={({ item, section }) => {
                  //TODO Mock condition till real conditions known
                  const icon = item.SubCategories.find(category => category.Id === 1)
                    ? ChatIcon
                    : item.SubCategories.find(category => category.Id === 2)
                    ? SwapIcon
                    : InfoCircleIcon;

                  const time =
                    section.day === SectionEnum.TODAY
                      ? formatDistance(item.CreatedOn, todayDate)
                      : section.day === SectionEnum.YESTERDAY
                      ? format(item.CreatedOn, "p")
                      : format(item.CreatedOn, "PPpp");
                  return (
                    <NotificationItem
                      title={item.NotificationName}
                      key={item.NotificationId}
                      subtitle={item.MessageContent}
                      time={time}
                      icon={createElement(icon)}
                    />
                  );
                }}
              />
            ))}

          <LoadingErrorNotification
            isVisible={isErrorModalVisible}
            onClose={() => setIsErrorModalVisible(false)}
            onRefresh={refetch}
          />
        </>
      )}
    </Page>
  );
}
