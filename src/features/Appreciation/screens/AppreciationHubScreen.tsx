import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { AngleDownIcon } from "@/assets/icons";
import { AppreciationCard } from "@/components";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import ContentContainer from "@/components/ContentContainer";
import DefaultContent from "@/components/DefaultContent";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";
import { PromotedEnum, SortingOptions, TabsTypes } from "@/types/Appreciation";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import emptyScreenImage from "../assets/empty-screen-image.png";
import { AppreciationError, SortingModal } from "../components";
import { FilterModal } from "../components";
import { SORTING_OPTIONS_ALL_TAB, SORTING_OPTIONS_OTHER_TABS } from "../constants";
import { useAppreciationFilters, useAppreciationSearch, useAppreciationWishlist } from "../hooks/query-hooks";
import { ActiveEnum, AppreciationType, FilterItemType, FiltersType } from "../types";

export default function AppreciationHubScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "Appreciation.HubScreen">>();
  const tabScreen = params?.tab;
  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.ALL);
  const [isSortingModalVisible, setIsSortingModalVisible] = useState<boolean>(false);
  const [sortingOptions, setSortingOptions] = useState<SortingOptions[]>(SORTING_OPTIONS_ALL_TAB);
  const [sortingModalCurrentOption, setSortingModalCurrentOption] = useState<SortingOptions>(sortingOptions[0]);
  const [currentSortingOption, setCurrentSortingOption] = useState<SortingOptions>(sortingOptions[0]);
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    Types: [],
    Locations: [],
    Categories: [],
    Sections: [],
  });
  const [appreciationLoadingErrorModal, setAppreciationLoadingErrorModal] = useState<boolean>(false);
  const [filtersLoadingErrorModal, setFiltersLoadingErrorModal] = useState<boolean>(false);

  const appreciationWishlist = useAppreciationWishlist();
  const {
    data: filtersData,
    refetch: refetchFilterHandler,
    isError: filterError,
  } = useAppreciationFilters(i18n.language);
  const {
    data: AppreciationListData,
    refetch,
    isError,
    isFetching,
  } = useAppreciationSearch(selectedFilters, currentSortingOption, currentTab, i18n.language);
  const [appreciationList, setAppreciationList] = useState<AppreciationType<boolean>[] | undefined>(undefined);
  const { data: userInfo } = useCustomerProfile();
  const userTier = userInfo?.CustomerTier ?? CustomerTierEnum.STANDARD;
  const userFullName = userInfo?.FullName;

  const hasFilters = useMemo(() => {
    return !selectedFilters
      ? false
      : Object.values(selectedFilters)
          .flat()
          .some(item => item.isActive);
  }, [selectedFilters]);

  useEffect(() => {
    if (tabScreen) setCurrentTab(tabScreen);
  }, [tabScreen]);

  const emptyListMessage = {
    [TabsTypes.ALL]: {
      title: t("Appreciation.HubScreen.EmptyList.AllTab.title"),
      subtitle: t("Appreciation.HubScreen.EmptyList.AllTab.subtitle"),
      SuggestionButton: t("Appreciation.HubScreen.EmptyList.AllTab.buttonText"),
      onSuggestionButtonPress: () => {
        navigation.navigate("WhatsNext.WhatsNextStack");
      },
      image: emptyScreenImage,
    },
    [TabsTypes.REDEEMED]: {
      title: t("Appreciation.HubScreen.EmptyList.RedeemedTab.title"),
      subtitle: t("Appreciation.HubScreen.EmptyList.RedeemedTab.subtitle"),
      SuggestionButton: t("Appreciation.HubScreen.EmptyList.RedeemedTab.buttonText"),
      onSuggestionButtonPress: () => {
        //TODO add the navigation to the target screen
      },
      image: emptyScreenImage,
    },
    [TabsTypes.LIKED]: {
      title: t("Appreciation.HubScreen.EmptyList.LikedTab.title"),
      subtitle: t("Appreciation.HubScreen.EmptyList.LikedTab.subtitle"),
      image: emptyScreenImage,
    },
  };

  useEffect(() => {
    setAppreciationList(AppreciationListData);
  }, [AppreciationListData]);

  useEffect(() => {
    if (isError) setAppreciationLoadingErrorModal(isError);
    if (filterError) setFiltersLoadingErrorModal(filterError);
  }, [isError, filterError]);

  useEffect(() => {
    clearFilters();
  }, [filtersData]);

  const clearFilters = () => {
    const updatedFilters = cloneDeep(filtersData);
    for (const property in updatedFilters) {
      if (Array.isArray(updatedFilters[property])) {
        updatedFilters[property].forEach((item: FilterItemType) => {
          item.isActive = false;
        });
      }
    }
    setSelectedFilters(updatedFilters);
  };

  const handleOnTabChange = (tab: TabsTypes) => {
    if (tab === TabsTypes.ALL) {
      setSortingOptions(SORTING_OPTIONS_ALL_TAB);
      setCurrentSortingOption(SORTING_OPTIONS_ALL_TAB[0]);
      setSortingModalCurrentOption(SORTING_OPTIONS_ALL_TAB[0]);
    } else {
      setSortingOptions(SORTING_OPTIONS_OTHER_TABS);
      setCurrentSortingOption(SORTING_OPTIONS_OTHER_TABS[0]);
      setSortingModalCurrentOption(SORTING_OPTIONS_OTHER_TABS[0]);
    }
    setCurrentTab(tab);
  };

  const handleOnBackButtonPress = () => {
    navigation.goBack();
  };

  const handleOnApplySortingButtonPress = () => {
    setCurrentSortingOption(sortingModalCurrentOption);
    setIsSortingModalVisible(false);
  };

  const handleOnCloseSortingModal = () => {
    setSortingModalCurrentOption(currentSortingOption);
    setIsSortingModalVisible(false);
  };

  const handleOnAppreciationCardPress = (appreciation: AppreciationType<boolean>) => {
    navigation.navigate("Appreciation.AppreciationDetailsScreen", {
      appreciation,
      userInfo: { userTier, userFullName },
      handleOnLikeAppreciation,
    });
  };

  const handleOnLikeAppreciation = async (id: string, isFavourite: boolean) => {
    try {
      await appreciationWishlist.mutateAsync(id);
      setAppreciationList(list =>
        list?.map((appreciation: AppreciationType<boolean>) => {
          if (appreciation.AppreciationId === id) return { ...appreciation, isFavourite: !isFavourite };
          else {
            return appreciation;
          }
        })
      );
    } catch (err) {}
  };

  const handleOnApplyFilterModalButtonPressed = (updatedFilters: FiltersType) => {
    setIsFiltersModalVisible(false);
    setSelectedFilters(updatedFilters);
  };

  const handleOnClearAllModalFiltersPressed = () => {
    clearFilters();
  };

  const handleOnModalFilterItemPressed = (filterCategory: FilterItemType, index: number, isActive: boolean) => {
    const updatedFilters = cloneDeep(selectedFilters);
    updatedFilters[filterCategory][index].isActive = !isActive;
    setSelectedFilters(updatedFilters);
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const segmentedControlOnFilterStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    padding: theme.spacing["8p"],
  }));

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["64p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const exploreContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing["12p"],
  }));

  const angleDownIconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <Page backgroundColor="neutralBase-60">
      <StatusBar backgroundColor="transparent" />
      {isFetching ? (
        <FlexActivityIndicator />
      ) : (
        <>
          <NavHeader
            title={t("Appreciation.HubScreen.title")}
            onBackPress={handleOnBackButtonPress}
            end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={() => setIsFiltersModalVisible(true)} />}
          />
          {!isError ? (
            <View>
              <View style={segmentedControlStyle}>
                {hasFilters ? (
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Stack direction="horizontal" gap="8p" style={segmentedControlOnFilterStyle}>
                      <Typography.Text>{t("Appreciation.HubScreen.filterBy")} </Typography.Text>
                      {selectedFilters
                        ? Object.keys(selectedFilters).map(filterCategory => {
                            return selectedFilters[filterCategory]?.map((filter, itemIndex) => {
                              return !filter.isActive ? null : (
                                <Chip
                                  key={itemIndex}
                                  title={filter.Name}
                                  isRemovable={true}
                                  isSelected={filter.isActive}
                                  onPress={() =>
                                    handleOnModalFilterItemPressed(filterCategory, itemIndex, filter.isActive)
                                  }
                                />
                              );
                            });
                          })
                        : null}
                      <Button variant="tertiary" onPress={handleOnClearAllModalFiltersPressed} size="mini">
                        {t("Appreciation.HubScreen.clearAll")}
                      </Button>
                    </Stack>
                  </ScrollView>
                ) : (
                  <SegmentedControl onPress={handleOnTabChange} value={currentTab}>
                    <SegmentedControl.Item value={TabsTypes.ALL}>
                      {t("Appreciation.HubScreen.all")}
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value={TabsTypes.REDEEMED}>
                      {t("Appreciation.HubScreen.redeemed")}
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value={TabsTypes.LIKED}>
                      {t("Appreciation.HubScreen.liked")}
                    </SegmentedControl.Item>
                  </SegmentedControl>
                )}
              </View>
              {appreciationList?.length === 0 ||
              (currentTab === TabsTypes.LIKED &&
                appreciationList?.every(item => item.ActiveFlag === ActiveEnum.EXPIRED)) ? (
                hasFilters ? (
                  <DefaultContent
                    title={t("Appreciation.HubScreen.FilterOptions.noAppreciationsFoundTitle")}
                    subtitle={t("Appreciation.HubScreen.FilterOptions.noAppreciationsFoundDescription")}
                    image={emptyScreenImage}
                  />
                ) : (
                  <DefaultContent
                    buttonText={
                      currentTab === TabsTypes.LIKED ? undefined : emptyListMessage[currentTab].SuggestionButton
                    }
                    onButtonPress={
                      currentTab === TabsTypes.LIKED ? undefined : emptyListMessage[currentTab].onSuggestionButtonPress
                    }
                    title={emptyListMessage[currentTab].title}
                    subtitle={emptyListMessage[currentTab].subtitle}
                    image={emptyScreenImage}
                  />
                )
              ) : (
                <ContentContainer isScrollView style={listContainerStyle}>
                  {currentTab === TabsTypes.ALL && appreciationList ? (
                    <>
                      {appreciationList?.filter(item => item.Section.Code === PromotedEnum.Code).length ? (
                        <View style={titleContainerStyle}>
                          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                            {t("Appreciation.HubScreen.promoted")}
                          </Typography.Text>
                        </View>
                      ) : null}
                      {appreciationList
                        ?.filter(item => item.Section.Code === PromotedEnum.Code)
                        .map((appreciation, index) => {
                          return (
                            <AppreciationCard
                              appreciation={appreciation}
                              userTier={userTier}
                              isPromoted={
                                currentTab === TabsTypes.ALL ? appreciation.Section.Code === PromotedEnum.Code : false
                              }
                              key={index}
                              onPress={handleOnAppreciationCardPress}
                              onLike={handleOnLikeAppreciation}
                            />
                          );
                        })}
                    </>
                  ) : null}
                  {!appreciationList?.every(item => item.Section.Code === PromotedEnum.Code) ? (
                    <View style={exploreContainerStyle}>
                      <View style={titleContainerStyle}>
                        <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                          {t("Appreciation.HubScreen.explore")}
                        </Typography.Text>
                      </View>
                      <View>
                        <Pressable style={styles.dropdownContainer} onPress={() => setIsSortingModalVisible(true)}>
                          <Typography.Text color="primaryBase" size="footnote" weight="medium" align="center">
                            {t(`Appreciation.HubScreen.FilterOptions.${currentSortingOption}`)}
                          </Typography.Text>
                          <AngleDownIcon color={angleDownIconColor} />
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                  {appreciationList
                    ? appreciationList
                        ?.filter(item =>
                          currentTab === TabsTypes.ALL
                            ? item.Section.Code !== PromotedEnum.Code
                            : currentTab === TabsTypes.LIKED
                            ? item.ActiveFlag === ActiveEnum.ACTIVE
                            : true
                        )
                        .map((appreciation, index) => {
                          return (
                            <AppreciationCard
                              appreciation={appreciation}
                              userTier={userTier}
                              isPromoted={
                                currentTab === TabsTypes.ALL ? appreciation.Section.Code === PromotedEnum.Code : false
                              }
                              key={index}
                              onPress={handleOnAppreciationCardPress}
                              onLike={handleOnLikeAppreciation}
                            />
                          );
                        })
                    : null}
                </ContentContainer>
              )}
            </View>
          ) : (
            <AppreciationError onRefresh={refetch} />
          )}
        </>
      )}
      {isFiltersModalVisible ? (
        <FilterModal
          onClose={() => setIsFiltersModalVisible(false)}
          onApplyButtonPress={handleOnApplyFilterModalButtonPressed}
          isVisible={isFiltersModalVisible}
          selectedFilters={selectedFilters}
        />
      ) : null}
      <SortingModal
        isVisible={isSortingModalVisible}
        onClose={handleOnCloseSortingModal}
        options={sortingOptions}
        currentValue={sortingModalCurrentOption}
        onChange={setSortingModalCurrentOption}
        isApplyButtonDisabled={currentSortingOption === sortingModalCurrentOption}
        onApplyButtonPressed={handleOnApplySortingButtonPress}
      />
      <LoadingErrorNotification
        isVisible={appreciationLoadingErrorModal}
        onClose={() => setAppreciationLoadingErrorModal(false)}
        onRefresh={refetch}
      />
      <LoadingErrorNotification
        isVisible={filtersLoadingErrorModal}
        onClose={() => setFiltersLoadingErrorModal(false)}
        onRefresh={refetchFilterHandler}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
