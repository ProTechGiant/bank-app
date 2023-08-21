import { useNavigation } from "@react-navigation/native";
import { cloneDeep, isEqual } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { AngleDownIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useFiltersList } from "@/hooks/use-appreciation";
import { useThemeStyles } from "@/theme";

import noAppreciationImage from "../assets/no-appreciation-image.png";
import noLikedAppreciationImage from "../assets/no-liked-appreciation-image.png";
import { AppreciationCard, SortingModal } from "../components";
import { FilterModal } from "../components";
import EmptyAppreciationList from "../components/EmptyAppreciationList";
import { AppreciationList, SORTING_OPTIONS_ALL_TAB, SORTING_OPTIONS_OTHER_TABS } from "../mockData";
import { FiltersType, SortingOptions, TabsTypes } from "../types";

export default function AppreciationHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const filtersData = useFiltersList();

  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.ALL);
  const [isSortingModalVisible, setIsSortingModalVisible] = useState<boolean>(false);
  const [sortingOptions, setSortingOptions] = useState<SortingOptions[]>(SORTING_OPTIONS_ALL_TAB);
  const [sortingModalCurrentOption, setSortingModalCurrentOption] = useState<SortingOptions>(sortingOptions[0]);
  const [currentSortingOption, setCurrentSortingOption] = useState<SortingOptions>(sortingOptions[0]);
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersType[]>(filtersData.data);
  const [selectedModalFilters, setSelectedModalFilters] = useState<FiltersType[]>(filtersData.data);

  const isApplySortingButtonDisabled = currentSortingOption === sortingModalCurrentOption;
  const isApplyButtonFilterModalDisabled = isEqual(filters, selectedModalFilters);
  const hasFilters = filters.find(filterCategory => filterCategory.filters.find(filter => filter.isActive));

  const emptyListTitle = hasFilters
    ? t("Appreciation.HubScreen.EmptyList.HasFilters.title")
    : currentTab === TabsTypes.ALL
    ? t("Appreciation.HubScreen.EmptyList.AllTab.title")
    : currentTab === TabsTypes.REDEEMED
    ? t("Appreciation.HubScreen.EmptyList.RedeemedTab.title")
    : t("Appreciation.HubScreen.EmptyList.LikedTab.title");

  const emptyListSubtitle = hasFilters
    ? t("Appreciation.HubScreen.EmptyList.HasFilters.subtitle")
    : currentTab === TabsTypes.ALL
    ? t("Appreciation.HubScreen.EmptyList.AllTab.subtitle")
    : currentTab === TabsTypes.REDEEMED
    ? t("Appreciation.HubScreen.EmptyList.RedeemedTab.subtitle")
    : t("Appreciation.HubScreen.EmptyList.LikedTab.subtitle");

  const emptyListImage = currentTab === TabsTypes.LIKED && !hasFilters ? noLikedAppreciationImage : noAppreciationImage;

  const emptyListButtonText =
    hasFilters || currentTab === TabsTypes.LIKED
      ? undefined
      : currentTab === TabsTypes.ALL
      ? t("Appreciation.HubScreen.EmptyList.AllTab.buttonText")
      : t("Appreciation.HubScreen.EmptyList.RedeemedTab.buttonText");

  const handleOnShowHistoryPress = () => {
    //TODO add the navigation to show history here
  };
  const handleOnWhatsNextPress = () => {
    //TODO add the navigation to show whats next here
  };

  const emptyListOnPressButton =
    currentTab === TabsTypes.ALL
      ? handleOnWhatsNextPress
      : currentTab === TabsTypes.REDEEMED
      ? handleOnShowHistoryPress
      : undefined;

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
    if (hasFilters) handleOnClearAllModalFiltersPressed(true);
    else navigation.goBack();
  };

  const handleOnApplySortingButtonPress = () => {
    setCurrentSortingOption(sortingModalCurrentOption);
    setIsSortingModalVisible(false);
  };

  const handleOnCloseSortingModal = () => {
    setSortingModalCurrentOption(currentSortingOption);
    setIsSortingModalVisible(false);
  };

  const handleOnApplyFilterModalButtonPressed = () => {
    setFilters(cloneDeep(selectedModalFilters));
    //TODO call the post request for the filtering with new data
    setIsFiltersModalVisible(false);
  };

  const handleOnClearAllModalFiltersPressed = (withApply = false) => {
    const updatedFilters = selectedModalFilters.map(filterCategory => {
      return {
        ...filterCategory,
        filters: filterCategory.filters.map(item => {
          return { ...item, isActive: false };
        }),
      };
    });
    setSelectedModalFilters(updatedFilters);
    if (withApply) setFilters(updatedFilters);
  };

  const handleOnModalFilterItemPressed = (categoryIndex: number, itemIndex: number, withApply = false) => {
    const updatedFilters = cloneDeep(selectedModalFilters);
    updatedFilters[categoryIndex].filters[itemIndex].isActive =
      !updatedFilters[categoryIndex].filters[itemIndex].isActive;
    setSelectedModalFilters(updatedFilters);
    if (withApply) setFilters(updatedFilters);
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
      <NavHeader
        title={t("Appreciation.HubScreen.title")}
        onBackPress={handleOnBackButtonPress}
        end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={() => setIsFiltersModalVisible(true)} />}
      />
      <View style={segmentedControlStyle}>
        {hasFilters ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Stack direction="horizontal" gap="8p" style={segmentedControlOnFilterStyle}>
              <Typography.Text>{t("Appreciation.HubScreen.filterBy")} </Typography.Text>
              {filters.map((filterCategory, categoryIndex) =>
                filterCategory.filters.map((filter, itemIndex) => {
                  if (filter.isActive)
                    return (
                      <Chip
                        title={filter.name}
                        isRemovable={true}
                        isSelected={true}
                        onPress={() => handleOnModalFilterItemPressed(categoryIndex, itemIndex, true)}
                      />
                    );
                  return null;
                })
              )}
              <Button variant="tertiary" onPress={() => handleOnClearAllModalFiltersPressed(true)} size="mini">
                {t("Appreciation.HubScreen.clearAll")}
              </Button>
            </Stack>
          </ScrollView>
        ) : (
          <SegmentedControl onPress={handleOnTabChange} value={currentTab}>
            <SegmentedControl.Item value={TabsTypes.ALL}>{t("Appreciation.HubScreen.all")}</SegmentedControl.Item>
            <SegmentedControl.Item value={TabsTypes.REDEEMED}>
              {t("Appreciation.HubScreen.redeemed")}
            </SegmentedControl.Item>
            <SegmentedControl.Item value={TabsTypes.LIKED}>{t("Appreciation.HubScreen.liked")}</SegmentedControl.Item>
          </SegmentedControl>
        )}
      </View>
      {AppreciationList.length === 0 ? (
        <EmptyAppreciationList
          buttonText={emptyListButtonText}
          onButtonPress={emptyListOnPressButton}
          title={emptyListTitle}
          subtitle={emptyListSubtitle}
          image={emptyListImage}
        />
      ) : (
        <ContentContainer isScrollView>
          <View style={titleContainerStyle}>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {t("Appreciation.HubScreen.promoted")}
            </Typography.Text>
          </View>
          <AppreciationCard appreciation={AppreciationList[0]} isPromoted={true} />
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
          {AppreciationList.map((appreciation, index) => {
            return <AppreciationCard appreciation={appreciation} key={index} />;
          })}
        </ContentContainer>
      )}

      <FilterModal
        onClose={() => setIsFiltersModalVisible(false)}
        onApplyButtonPress={handleOnApplyFilterModalButtonPressed}
        onClearAllPressed={handleOnClearAllModalFiltersPressed}
        onFilterItemPressed={handleOnModalFilterItemPressed}
        filters={selectedModalFilters}
        isVisible={isFiltersModalVisible}
        isApplyButtonDisabled={isApplyButtonFilterModalDisabled}
      />
      <SortingModal
        isVisible={isSortingModalVisible}
        onClose={handleOnCloseSortingModal}
        options={sortingOptions}
        currentValue={sortingModalCurrentOption}
        onChange={setSortingModalCurrentOption}
        isApplyButtonDisabled={isApplySortingButtonDisabled}
        onApplyButtonPressed={handleOnApplySortingButtonPress}
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
