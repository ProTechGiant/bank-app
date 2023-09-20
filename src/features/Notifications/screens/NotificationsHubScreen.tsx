import { format, formatDistance, isToday, isYesterday, startOfToday, subDays } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { uniqBy } from "lodash";
import { createElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { ChatIcon, InfoCircleIcon, SwapIcon } from "@/assets/icons";
import Chip from "@/components/Chip";
import DefaultContent from "@/components/DefaultContent";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { LoadMoreIcon } from "../assets/LoadMoreIcon";
import noNotificationImage from "../assets/no-notifications-image.png";
import { FilterModal, NotificationError, NotificationItem } from "../components";
import { useAllNotifications, useFilterNotifications } from "../hooks/query-hooks";
import { FilterType, InfoIconValues, NotificationType, PAGE_SIZE, SectionEnum, SwapIconValues } from "../types";

export default function NotificationsHubScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const todayDate = startOfToday();
  const from30DaysDate = subDays(new Date(todayDate), 31);

  const auth = useAuthContext();
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>();
  const notificationsRef = useRef<NotificationType<Date>[]>([]);

  const { data, isError, isFetching, refetch } = useAllNotifications(
    PAGE_SIZE,
    pageNumber,
    format(from30DaysDate, "yyyy-MM-dd"),
    format(todayDate, "yyyy-MM-dd")
  );

  const {
    data: filteredData,
    isError: isFilterDataError,
    isFetching: isFetchingFilterData,
    refetch: refetchFilteredData,
  } = useFilterNotifications(
    PAGE_SIZE,
    0,
    format(from30DaysDate, "yyyy-MM-dd"),
    format(todayDate, "yyyy-MM-dd"),
    selectedFilter?.Id ?? ""
  );

  if (data !== undefined)
    notificationsRef.current = uniqBy([...notificationsRef.current, ...data.Notifications], "NotificationId");

  useEffect(() => {
    if (data?.SubCategories) {
      setFilters(categories => uniqBy([...categories, ...data.SubCategories], "Id"));
    }
  }, [data?.SubCategories]);

  useEffect(() => {
    auth.setNotificationsReadStatus(true);
  }, []);

  const todaySection = {
    day: SectionEnum.TODAY,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.TODAY}`),
    data:
      selectedFilter === undefined
        ? notificationsRef.current.filter(object => isToday(object.CreatedOn))
        : filteredData?.Notifications.filter(object => isToday(object.CreatedOn)) ?? [],
  };
  const yesterdaySection = {
    day: SectionEnum.YESTERDAY,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.YESTERDAY}`),
    data:
      selectedFilter === undefined
        ? notificationsRef.current.filter(notification => isYesterday(notification.CreatedOn))
        : filteredData?.Notifications.filter(notification => isYesterday(notification.CreatedOn)) ?? [],
  };
  const olderSection = {
    day: SectionEnum.OLDER,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.OLDER}`),
    data:
      selectedFilter === undefined
        ? notificationsRef.current.filter(
            notification => !isToday(notification.CreatedOn) && !isYesterday(notification.CreatedOn)
          )
        : filteredData?.Notifications.filter(
            notification => !isToday(notification.CreatedOn) && !isYesterday(notification.CreatedOn)
          ) ?? [],
  };

  useEffect(() => {
    setIsErrorModalVisible(isError || isFilterDataError);
  }, [isError, isFilterDataError]);

  useEffect(() => {
    if (notificationsRef.current.length < PAGE_SIZE * (pageNumber + 1)) {
      setIsAllDataLoaded(true);
    }
  }, [data, pageNumber]);

  const loadMoreData = () => {
    if (!isAllDataLoaded) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleOnExploreMorePress = () => {
    navigation.navigate("WhatsNext.WhatsNextStack");
  };

  const handleOnFilterApplyButtonPress = () => {
    setSelectedFilter(filters.find(filter => filter.isActive));
    setIsFiltersModalVisible(false);
    refetchFilteredData();
  };

  const handleOnFilterItemPress = (id: string) => {
    setFilters(filters.map(filter => ({ ...filter, isActive: filter.Id === id ? !filter.isActive : false })));
  };

  const clearAllFilters = () => {
    setFilters(f => f.map(filter => ({ ...filter, isActive: false })));
    setSelectedFilter(undefined);
  };

  const filteredOptionStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["32p"],
  }));

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

  const handleOnItemPressed = (item: NotificationType<Date>) => {
    navigation.navigate(item.SubCategoryStack, { screen: item.SubCategoryScreen });
  };

  return (
    <Page insets={["left"]}>
      {isFetching || isFetchingFilterData ? (
        <FlexActivityIndicator />
      ) : (
        <>
          <NavHeader
            variant="angled"
            title={t("Notifications.NotificationHubScreen.title")}
            end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={() => setIsFiltersModalVisible(true)} />}
          />
          {!isError ? (
            <View>
              {selectedFilter && (
                <Stack direction="horizontal" gap="8p" style={filteredOptionStyle}>
                  <Typography.Text>{t("Notifications.NotificationHubScreen.filterBy")}</Typography.Text>
                  <Chip title={selectedFilter.Name} isRemovable={true} isSelected={true} onPress={clearAllFilters} />
                </Stack>
              )}
              {(selectedFilter === undefined && notificationsRef.current.length === 0) ||
              (selectedFilter !== undefined && filteredData?.Notifications.length === 0) ? (
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
                  sections={[todaySection, yesterdaySection, olderSection]}
                  renderSectionHeader={({ section }) =>
                    section.data.length !== 0 ? (
                      <Typography.Text weight="medium" size="callout" color="neutralBase-10" style={sectionTitleStyle}>
                        {section.title}
                      </Typography.Text>
                    ) : null
                  }
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
                  onEndReached={loadMoreData}
                  renderItem={({ item, section }) => {
                    const icon = InfoIconValues.includes(item.SubCategoryName)
                      ? InfoCircleIcon
                      : SwapIconValues.includes(item.SubCategoryName)
                      ? SwapIcon
                      : ChatIcon;

                    const time =
                      section.day === SectionEnum.TODAY
                        ? formatDistance(item.CreatedOn, new Date(), {
                            addSuffix: true,
                            locale: i18n.language === "en" ? enUS : arSA,
                          })
                        : section.day === SectionEnum.YESTERDAY
                        ? format(item.CreatedOn, "p", {
                            locale: i18n.language === "en" ? enUS : arSA,
                          })
                        : format(item.CreatedOn, "PPpp", {
                            locale: i18n.language === "en" ? enUS : arSA,
                          });

                    return (
                      <NotificationItem
                        onPress={() => handleOnItemPressed(item)}
                        title={item.NotificationName}
                        key={item.NotificationId}
                        subtitle={item.MessageContent}
                        time={time}
                        icon={createElement(icon)}
                      />
                    );
                  }}
                />
              )}
              <LoadingErrorNotification
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                onRefresh={selectedFilter !== undefined ? refetchFilteredData : refetch}
              />
              <FilterModal
                isVisible={isFiltersModalVisible}
                setIsVisible={setIsFiltersModalVisible}
                filters={filters}
                onItemPress={handleOnFilterItemPress}
                onApplyButtonPress={handleOnFilterApplyButtonPress}
                isApplyButtonDisabled={selectedFilter === filters.find(filter => filter.isActive)}
              />
            </View>
          ) : (
            <NotificationError onRefresh={refetch} />
          )}
        </>
      )}
    </Page>
  );
}
