import { format, formatDistance, isToday, isYesterday, startOfToday, subDays } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { uniqBy } from "lodash";
import { createElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SectionList, StyleSheet, View, ViewStyle } from "react-native";

import { FilterIcon, InfoCircleIcon, SwapIcon } from "@/assets/icons";
import Chip from "@/components/Chip";
import DefaultContent from "@/components/DefaultContent";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
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
import { FilterType, NotificationType, PAGE_SIZE, SectionEnum, SectionType } from "../types";

export default function NotificationsHubScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const todayDate = startOfToday();
  const from30DaysDate = subDays(new Date(todayDate), 31);

  const auth = useAuthContext();
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [filteredDataPageNumber, setFilteredDataPageNumber] = useState<number>(0);
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>();
  const [isFirstTimeFetch, setIsFirstTimeFetch] = useState<boolean>(true);
  const [noScreenNotification, setNoScreenNotification] = useState<NotificationType<Date>>();

  const notificationsRef = useRef<NotificationType<Date>[]>([]);
  let isAllDataLoaded = false;

  const filteredDataRef = useRef<NotificationType<Date>[]>([]);
  let isAllFilteredDataLoaded = false;

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
    filteredDataPageNumber,
    format(from30DaysDate, "yyyy-MM-dd"),
    format(todayDate, "yyyy-MM-dd"),
    selectedFilter?.Id ?? ""
  );

  if (data !== undefined) {
    notificationsRef.current = uniqBy([...notificationsRef.current, ...data.Notifications], "NotificationId");
    isAllDataLoaded = notificationsRef.current.length < PAGE_SIZE * (pageNumber + 1);
  }

  if (filteredData !== undefined) {
    filteredDataRef.current = uniqBy([...filteredDataRef.current, ...filteredData.Notifications], "NotificationId");
    isAllFilteredDataLoaded = filteredDataRef.current.length < PAGE_SIZE * (filteredDataPageNumber + 1);
  }

  const todaySection: SectionType = {
    day: SectionEnum.TODAY,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.TODAY}`),
    data:
      selectedFilter === undefined
        ? notificationsRef.current.filter(object => isToday(object.CreatedOn))
        : filteredDataRef.current.filter(object => isToday(object.CreatedOn)),
  };
  const yesterdaySection: SectionType = {
    day: SectionEnum.YESTERDAY,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.YESTERDAY}`),
    data:
      selectedFilter === undefined
        ? notificationsRef.current.filter(notification => isYesterday(notification.CreatedOn))
        : filteredDataRef.current.filter(notification => isYesterday(notification.CreatedOn)),
  };
  const olderSection: SectionType = {
    day: SectionEnum.OLDER,
    title: t(`Notifications.NotificationHubScreen.sections.${SectionEnum.OLDER}`),
    data:
      selectedFilter === undefined
        ? notificationsRef.current.filter(
            notification => !isToday(notification.CreatedOn) && !isYesterday(notification.CreatedOn)
          )
        : filteredDataRef.current.filter(
            notification => !isToday(notification.CreatedOn) && !isYesterday(notification.CreatedOn)
          ),
  };

  useEffect(() => {
    if (data?.SubCategories) {
      setFilters(categories => uniqBy([...categories, ...data.SubCategories], "Id"));
    }
  }, [data?.SubCategories]);

  useEffect(() => {
    auth.setNotificationsReadStatus(true);
  }, []);

  useEffect(() => {
    if (!isFetching && !isFetchingFilterData) {
      setIsFirstTimeFetch(false);
    }
  }, [isFetching, isFetchingFilterData]);

  useEffect(() => {
    setIsErrorModalVisible(isError || isFilterDataError);
    if (isError || isFilterDataError) setIsFirstTimeFetch(true);
  }, [isError, isFilterDataError]);

  const loadMoreData = () => {
    if (!isAllDataLoaded && selectedFilter === undefined) {
      setPageNumber(p => p + 1);
    }
    if (!isAllFilteredDataLoaded && selectedFilter !== undefined) {
      setFilteredDataPageNumber(p => p + 1);
    }
  };

  const handleOnExploreMorePress = () => {
    navigation.navigate("WhatsNext.WhatsNextStack");
  };

  const handleOnFilterApplyButtonPress = () => {
    setSelectedFilter(filters.find(filter => filter.isActive));
    setIsFirstTimeFetch(true);
    filteredDataRef.current = [];
    setFilteredDataPageNumber(0);
    setIsFiltersModalVisible(false);
  };

  const handleOnFilterItemPress = (id: string) => {
    setFilters(filters.map(filter => ({ ...filter, isActive: filter.Id === id ? !filter.isActive : false })));
  };

  const refetchData = () => {
    if (selectedFilter === undefined) refetch();
    else refetchFilteredData();
    setIsFirstTimeFetch(true);
    setIsErrorModalVisible(false);
  };

  const handleOnItemPressed = (item: NotificationType<Date>) => {
    if (
      item.SubCategoryName === "" ||
      item.SubCategoryScreen === "" ||
      item.SubCategoryName === undefined ||
      item.SubCategoryScreen === undefined
    ) {
      setNoScreenNotification(item);
      return;
    }
    navigation.navigate(item.SubCategoryStack, { screen: item.SubCategoryScreen });
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
    flex: 1,
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

  const reloadButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  return (
    <Page insets={["left"]}>
      <NavHeader
        variant="angled"
        title={t("Notifications.NotificationHubScreen.title")}
        end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={() => setIsFiltersModalVisible(true)} />}
      />

      {isFirstTimeFetch ? (
        <FlexActivityIndicator />
      ) : !isError && !isFilterDataError ? (
        <View style={styles.contentContainerStyle}>
          {selectedFilter && (
            <Stack direction="horizontal" gap="8p" style={filteredOptionStyle}>
              <Typography.Text>{t("Notifications.NotificationHubScreen.filterBy")}</Typography.Text>
              <Chip title={selectedFilter.Name} isRemovable={true} isSelected={true} onPress={clearAllFilters} />
            </Stack>
          )}
          {(selectedFilter === undefined && notificationsRef.current.length === 0) ||
          (selectedFilter !== undefined && filteredDataRef.current.length === 0) ? (
            <DefaultContent
              title={t("Notifications.NotificationHubScreen.emptyPage.title")}
              subtitle={t("Notifications.NotificationHubScreen.emptyPage.subtitle")}
              image={noNotificationImage}
              buttonText={t("Notifications.NotificationHubScreen.emptyPage.buttonText")}
              onButtonPress={handleOnExploreMorePress}
            />
          ) : (
            <SectionList
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
                (selectedFilter === undefined && !isAllDataLoaded) ||
                (selectedFilter !== undefined && !isAllFilteredDataLoaded) ? (
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
                const icon =
                  item.SubCategoryName === "" ||
                  item.SubCategoryScreen === "" ||
                  item.SubCategoryName === undefined ||
                  item.SubCategoryScreen === undefined
                    ? InfoCircleIcon
                    : SwapIcon;

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
          <FilterModal
            isVisible={isFiltersModalVisible}
            setIsVisible={setIsFiltersModalVisible}
            filters={filters}
            onItemPress={handleOnFilterItemPress}
            onApplyButtonPress={handleOnFilterApplyButtonPress}
            isApplyButtonDisabled={selectedFilter === filters.find(filter => filter.isActive)}
          />
          {noScreenNotification !== undefined ? (
            <NotificationModal
              variant="confirmations"
              title={noScreenNotification.NotificationName}
              message={noScreenNotification.MessageContent}
              isVisible={noScreenNotification !== undefined}
              onClose={() => setNoScreenNotification(undefined)}
            />
          ) : null}
        </View>
      ) : (
        <NotificationError onRefresh={refetchData} />
      )}
      <NotificationModal
        variant="error"
        title={t("Notifications.NotificationHubScreen.NotificationError.title")}
        message={t("Notifications.NotificationHubScreen.NotificationError.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        buttons={{
          primary: (
            <Pressable onPress={refetchData} style={reloadButtonStyle}>
              <Typography.Text color="primaryBase">
                {t("Notifications.NotificationHubScreen.NotificationError.button")}
              </Typography.Text>
            </Pressable>
          ),
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  },
});
