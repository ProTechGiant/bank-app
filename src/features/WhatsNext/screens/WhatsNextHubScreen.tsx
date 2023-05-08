import { isEmpty, isEqual, xorWith } from "lodash";
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
  const [selectedCategories, setSelectedCategories] = useState<FilterItemType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<FilterItemType[]>([]);
  const [hasFilters, setHasFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    WhatsNextMocks.filter(val => val.WhatsNextCategories && val.WhatsNextTypes)?.map(data => {
      data.WhatsNextCategories?.map(item => {
        setWhatsNextCategories(prevState => [...prevState, { name: item, isActive: false }]);
        setSelectedCategories(prevState => [...prevState, { name: item, isActive: false }]);
      });
      data.WhatsNextTypes?.map(item => {
        setWhatsNextTypes(prevState => [...prevState, { name: item, isActive: false }]);
        setSelectedTypes(prevState => [...prevState, { name: item, isActive: false }]);
      });
    });
  }, []);

  useEffect(() => {
    setHasFilters([...whatsNextCategories, ...whatsNextTypes].some(value => value.isActive));
    updateParamsQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsNextCategories, whatsNextTypes]);

  const handleOnClearFiltersPress = (setWhatsNextStates: boolean) => {
    if (setWhatsNextStates) {
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
    }

    setSelectedTypes(
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
    setSelectedCategories(
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

  const handleOnCategoryFilterItemPress = (index: number) => {
    setSelectedCategories(
      selectedCategories.map((item, ind) => {
        if (ind !== index) {
          return item;
        }
        return {
          ...item,
          isActive: !item.isActive,
        };
      })
    );
  };

  const handleOnTypeFilterItemPress = (index: number) => {
    setSelectedTypes(
      selectedTypes.map((item, ind) => {
        if (ind !== index) {
          return item;
        }
        return {
          ...item,
          isActive: !item.isActive,
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
    setSelectedTypes(
      whatsNextTypes.map(item => {
        if (item.name !== name) {
          return item;
        }
        return {
          ...item,
          isActive: false,
        };
      })
    );
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
    setSelectedCategories(
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
  };

  const handleOnLoadingErrorRefresh = () => {
    //@TODO refetch data
  };

  const handleOnSortingModalPress = () => {
    setIsSortingContentVisible(!isSortingContentVisible);
  };

  const handleOnFiltersModalVisiblePress = () => {
    setSelectedCategories(whatsNextCategories);
    setSelectedTypes(whatsNextTypes);
    setIsFiltersModalVisible(!isFiltersModalVisible);
  };

  const updateParamsQuery = () => {
    let whatsNextTypeQuery =
      whatsNextTypes &&
      whatsNextTypes?.length &&
      whatsNextTypes
        .filter(data => data.isActive === true)
        .map(data => data.name)
        .join(",");
    whatsNextTypeQuery ? (whatsNextTypeQuery = "WhatsNextType=" + whatsNextTypeQuery) : null;

    let whatsNextCategoryQuery =
      whatsNextCategories &&
      whatsNextCategories.length &&
      whatsNextCategories
        .filter(data => data.isActive === true)
        .map(data => data.name)
        .join(",");
    whatsNextCategoryQuery ? (whatsNextCategoryQuery = "WhatsNextCategory=" + whatsNextCategoryQuery) : null;
  };

  const handleOnApplyFilterPress = () => {
    setWhatsNextCategories(selectedCategories);
    setWhatsNextTypes(selectedTypes);
    handleOnFiltersModalVisiblePress();
  };

  const handleOnExploreArticlePress = (articleId: string) => {
    navigation.navigate("WhatsNext.ExploreArticleScreen", { articleId });
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
            {hasFilters ? (
              <FilterTopBar
                whatsNextTypes={whatsNextTypes}
                whatsNextCategories={whatsNextCategories}
                onTypeFilterItemRemovePress={handleOnTypeFilterItemRemovePress}
                onCategoryFilterItemRemovePress={handleOnCategoryFilterItemRemovePress}
                onClearFiltersPress={() => handleOnClearFiltersPress(true)}
              />
            ) : (
              <TopTenSection
                onPress={handleOnTopTenArticlePress}
                data={WhatsNextMocks.find(data => data.ContentTag === "Top 10") as ArticleSectionType}
              />
            )}
            {WhatsNextMocks.filter(data => data.ContentTag === "explore").length !== 0 ? (
              <ExploreSection
                data={WhatsNextMocks.filter(data => data.ContentTag === "explore") as ArticleSectionType[]}
                onArticlePress={articleId => {
                  handleOnExploreArticlePress(articleId);
                }}
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
        onClose={handleOnFiltersModalVisiblePress}
        isVisible={isFiltersModalVisible}
        categories={selectedCategories}
        types={selectedTypes}
        onApplyFilterPress={handleOnApplyFilterPress}
        onClearFilterPress={() => handleOnClearFiltersPress(false)}
        onCategoryFilterItemPress={handleOnCategoryFilterItemPress}
        onTypeFilterItemPress={handleOnTypeFilterItemPress}
        isApplyButtonDisabled={
          isEmpty(xorWith(selectedCategories, whatsNextCategories, isEqual)) &&
          isEmpty(xorWith(selectedTypes, whatsNextTypes, isEqual))
        }
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
