import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { FilterIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import { LoadingErrorPage } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import {
  ExploreSection,
  FilterModal,
  FilterTopBar,
  NoArticlesError,
  SortingContentModal,
  TopTenSection,
} from "../components";
import { ArticleSectionType, FilterItemType } from "../types";
import { WhatsNextMocks } from "../whatsNextMocks";

export default function WhatsNextHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);
  const [isSortingContentVisible, setIsSortingContentVisible] = useState(false);
  const [whatsNextCategories, setWhatsNextCategories] = useState<FilterItemType[]>([]);
  const [whatsNextTypes, setWhatsNextTypes] = useState<FilterItemType[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    WhatsNextMocks.filter(val => val.WhatsNextCategories && val.WhatsNextTypes)?.map(data => {
      data.WhatsNextCategories?.map(item => {
        setWhatsNextCategories(prevState => [...prevState, { name: item, isActive: false }]);
      });
      data.WhatsNextTypes?.map(item => {
        setWhatsNextTypes(prevState => [...prevState, { name: item, isActive: false }]);
      });
    });
  }, []);

  useEffect(() => {
    setIsFiltering([...whatsNextCategories, ...whatsNextTypes].filter(value => value.isActive).length !== 0);
  }, [whatsNextCategories, whatsNextTypes]);

  const handleOnClearFiltersPress = () => {
    setWhatsNextTypes(
      whatsNextTypes.map(item => {
        if (item.isActive === false) {
          return item;
        }
        return {
          name: item.name,
          isActive: false,
        };
      })
    );
    setWhatsNextCategories(
      whatsNextCategories.map(item => {
        if (item.isActive === false) {
          return item;
        }
        return {
          name: item.name,
          isActive: false,
        };
      })
    );
  };

  const handleOnSortOrderChange = (value: "newest" | "oldest") => {
    setSortOrder(value);
    setIsSortingContentVisible(false);
  };

  const handleOnTypeFilterItemRemovePress = (name: string) => {
    setWhatsNextTypes(
      whatsNextTypes.map(item => {
        if (item.name !== name) {
          return item;
        }
        return {
          name: item.name,
          isActive: false,
        };
      })
    );
    updateParamsQuery();
  };

  const handleOnCategoryFilterItemRemovePress = (name: string) => {
    setWhatsNextCategories(
      whatsNextCategories.map(item => {
        if (item.name !== name) {
          return item;
        }
        return {
          ...item,
          isActive: false,
        };
      })
    );
    updateParamsQuery();
  };

  const handleOnLoadingErrorRefresh = () => {
    //@TODO refetch data
  };

  const handleOnSortingModalPress = () => {
    setIsSortingContentVisible(!isSortingContentVisible);
  };

  const handleOnFiltersModalVisiblePress = () => {
    setIsFiltersModalVisible(!isFiltersModalVisible);
  };

  const updateParamsQuery = () => {
    let whatsNextTypeQuery = "";
    whatsNextTypes.map(data => {
      if (data.isActive === true) {
        if (whatsNextTypeQuery === "") {
          whatsNextTypeQuery = "WhatsNextType=";
        } else {
          whatsNextTypeQuery = whatsNextTypeQuery + ",";
        }
        whatsNextTypeQuery = whatsNextTypeQuery + data.name;
      }
    });
    let whatsNextCategoryQuery = "";
    whatsNextCategories.map(data => {
      if (data.isActive === true) {
        if (whatsNextCategoryQuery === "") {
          whatsNextCategoryQuery = "WhatsNextCategory=";
        } else {
          whatsNextCategoryQuery = whatsNextCategoryQuery + ",";
        }
        whatsNextCategoryQuery = whatsNextCategoryQuery + data.name;
      }
    });
  };

  const handleOnFilterApplyPress = (categories: FilterItemType[], types: FilterItemType[]) => {
    setWhatsNextCategories(categories);
    setWhatsNextTypes(types);
    updateParamsQuery();
    handleOnFiltersModalVisiblePress();
  };

  const handleOnExploreArticlePress = () => {
    navigation.navigate("WhatsNext.ExploreArticleScreen");
  };

  const handleOnTopTenArticlePress = () => {
    navigation.navigate("WhatsNext.TopTenArticleScreen");
  };

  return (
    <>
      {WhatsNextMocks !== undefined ? (
        <Page backgroundColor="neutralBase-60">
          <NavHeader
            title={t("WhatsNext.HubScreen.title")}
            end={
              <Pressable onPress={handleOnFiltersModalVisiblePress}>
                <FilterIcon />
              </Pressable>
            }
          />
          <ContentContainer isScrollView>
            {isFiltering === false ? (
              <TopTenSection
                onPress={handleOnTopTenArticlePress}
                data={WhatsNextMocks.find(data => data?.ContentTag === "Top 10") as ArticleSectionType}
              />
            ) : (
              <FilterTopBar
                whatsNextTypes={whatsNextTypes}
                whatsNextCategories={whatsNextCategories}
                onTypeFilterItemRemovePress={handleOnTypeFilterItemRemovePress}
                onCategoryFilterItemRemovePress={handleOnCategoryFilterItemRemovePress}
                onClearFiltersPress={handleOnClearFiltersPress}
              />
            )}
            {WhatsNextMocks.filter(data => data.ContentTag === "explore").length !== 0 ? (
              <ExploreSection
                data={WhatsNextMocks.filter(data => data.ContentTag === "explore") as ArticleSectionType[]}
                onArticlePress={handleOnExploreArticlePress}
                onSortByTimePress={handleOnSortingModalPress}
                sortOrder={sortOrder}
              />
            ) : (
              <NoArticlesError />
            )}
          </ContentContainer>
        </Page>
      ) : (
        <LoadingErrorPage onRefresh={handleOnLoadingErrorRefresh} />
      )}
      <FilterModal
        onFiltersApplyPress={handleOnFilterApplyPress}
        onClose={handleOnFiltersModalVisiblePress}
        isVisible={isFiltersModalVisible}
        initialCategories={whatsNextCategories}
        initialTypes={whatsNextTypes}
      />
      <SortingContentModal
        onClose={handleOnSortingModalPress}
        isVisible={isSortingContentVisible}
        onChange={handleOnSortOrderChange}
        sortOrder={sortOrder}
      />
    </>
  );
}
