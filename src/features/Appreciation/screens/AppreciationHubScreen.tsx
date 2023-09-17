import { useNavigation } from "@react-navigation/native";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { AngleDownIcon } from "@/assets/icons";
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
import { useThemeStyles } from "@/theme";
import { SortingOptions, TabsTypes } from "@/types/Appreciation";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import noAppreciationFilter from "../assets/no-appreciation-filter.png";
import noAppreciationImage from "../assets/no-appreciation-image.png";
import noLikedAppreciationImage from "../assets/no-liked-appreciation-image.png";
import { AppreciationCard, AppreciationError, SortingModal } from "../components";
import { FilterModal } from "../components";
import { SORTING_OPTIONS_ALL_TAB, SORTING_OPTIONS_OTHER_TABS } from "../constants";
import { useAppreciationFilters, useAppreciationSearch } from "../hooks/query-hooks";
import { AppreciationType, FilterItemType, FiltersType } from "../types";

export default function AppreciationHubScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.ALL);
  const [isSortingModalVisible, setIsSortingModalVisible] = useState<boolean>(false);
  const [sortingOptions, setSortingOptions] = useState<SortingOptions[]>(SORTING_OPTIONS_ALL_TAB);
  const [sortingModalCurrentOption, setSortingModalCurrentOption] = useState<SortingOptions>(sortingOptions[0]);
  const [currentSortingOption, setCurrentSortingOption] = useState<SortingOptions>(sortingOptions[0]);
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<FiltersType | null>(null);
  const [appreciationLoadingErrorModal, setAppreciationLoadingErrorModal] = useState<boolean>(false);
  const [filtersLoadingErrorModal, setFiltersLoadingErrorModal] = useState<boolean>(false);
  const {
    data: filtersData,
    refetch: refetchFilterHandler,
    isError: filterError,
  } = useAppreciationFilters(i18n.language);
  const {
    data: AppreciationList,
    refetch,
    isError,
    isFetching,
  } = useAppreciationSearch(selectedFilters, currentSortingOption, currentTab, i18n.language);
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

  const emptyListMessage = {
    [TabsTypes.ALL]: {
      title: t("Appreciation.HubScreen.EmptyList.AllTab.title"),
      subtitle: t("Appreciation.HubScreen.EmptyList.AllTab.subtitle"),
      SuggestionButton: t("Appreciation.HubScreen.EmptyList.AllTab.buttonText"),
      onSuggestionButtonPress: () => {
        navigation.navigate("WhatsNext.WhatsNextStack");
      },
      image: noAppreciationImage,
    },
    [TabsTypes.REDEEMED]: {
      title: t("Appreciation.HubScreen.EmptyList.RedeemedTab.title"),
      subtitle: t("Appreciation.HubScreen.EmptyList.RedeemedTab.subtitle"),
      SuggestionButton: t("Appreciation.HubScreen.EmptyList.RedeemedTab.buttonText"),
      onSuggestionButtonPress: () => {
        //TODO add the navigation to the target screen
      },
      image: noAppreciationImage,
    },
    [TabsTypes.LIKED]: {
      title: t("Appreciation.HubScreen.EmptyList.LikedTab.title"),
      subtitle: t("Appreciation.HubScreen.EmptyList.LikedTab.subtitle"),
      image: noLikedAppreciationImage,
    },
  };

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

  const handleOnAppreciationCardPress = (appreciation: AppreciationType) => {
    navigation.navigate("Appreciation.AppreciationDetailsScreen", {
      appreciation,
      userInfo: { userTier, userFullName },
    });
  };

  const handleOnLikeAppreciation = () => {
    //TODO like an appreciation logic
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
                      {selectedFilters &&
                        Object.keys(selectedFilters).map(filterCategory => {
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
                        })}
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
              {AppreciationList?.length === 0 ? (
                hasFilters ? (
                  <DefaultContent
                    title={t("Appreciation.HubScreen.FilterOptions.noAppreciationsFoundTitle")}
                    subtitle={t("Appreciation.HubScreen.FilterOptions.noAppreciationsFoundDescription")}
                    image={noAppreciationFilter}
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
                    image={currentTab === TabsTypes.LIKED ? noLikedAppreciationImage : noAppreciationImage}
                  />
                )
              ) : (
                <ContentContainer isScrollView>
                  {currentTab === TabsTypes.ALL && AppreciationList && (
                    <>
                      {AppreciationList?.filter(item => item.Ranking === 1).length ? (
                        <View style={titleContainerStyle}>
                          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                            {t("Appreciation.HubScreen.promoted")}
                          </Typography.Text>
                        </View>
                      ) : null}
                      {AppreciationList?.filter(item => item.Ranking === 1).map((appreciation, index) => {
                        return (
                          <AppreciationCard
                            appreciation={appreciation}
                            userTier={userTier}
                            key={index}
                            onPress={handleOnAppreciationCardPress}
                            onLike={handleOnLikeAppreciation}
                          />
                        );
                      })}
                    </>
                  )}
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
                  {AppreciationList &&
                    AppreciationList?.filter(item => item.Ranking !== 1).map((appreciation, index) => {
                      return (
                        <AppreciationCard
                          appreciation={appreciation}
                          userTier={userTier}
                          key={index}
                          onPress={handleOnAppreciationCardPress}
                          onLike={handleOnLikeAppreciation}
                        />
                      );
                    })}
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
