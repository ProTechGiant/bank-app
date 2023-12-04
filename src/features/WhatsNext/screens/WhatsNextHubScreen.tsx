import { find, isEmpty, isEqual, xorWith } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import { FilterIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useContentArticleList } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { Content } from "@/types/Content";

import {
  EmptyArticleListError,
  ExploreSection,
  FilterModal,
  FilterTopBar,
  SortingContentModal,
  TopTenSection,
} from "../components";
import { EXPLORE_CONTENT_TAG, SORT_NEWEST, SORT_OLDEST, TOP10_CONTENT_TAG, WHATS_NEXT_CATEGORY_ID } from "../constants";
import { ArticleSectionType, FilterItemType } from "../types";

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
  const [sortOrder, setSortOrder] = useState<typeof SORT_NEWEST | typeof SORT_OLDEST>(SORT_NEWEST);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({ sort: sortOrder });
  const [isLoadingErrorModalVisible, setIsLoadingErrorModalVisible] = useState<boolean>(false);

  const whatsNextData = useContentArticleList(WHATS_NEXT_CATEGORY_ID, true, false, queryParams);

  useEffect(() => {
    if (whatsNextData.data && whatsNextData.data.length > 0) {
      whatsNextData.data
        .filter(val => {
          return val.WhatsNextCategories && val.WhatsNextTypes;
        })
        .forEach(data => {
          data.WhatsNextCategories?.forEach(item => {
            if (!find(whatsNextCategories, { id: item.Id })) {
              setWhatsNextCategories(prevState => [...prevState, { id: item.Id, name: item.Name, isActive: false }]);
              setSelectedCategories(prevState => [...prevState, { id: item.Id, name: item.Name, isActive: false }]);
            }
          });

          data.WhatsNextTypes?.forEach(item => {
            if (!find(whatsNextTypes, { id: item.Id })) {
              setWhatsNextTypes(prevState => [...prevState, { id: item.Id, name: item.Name, isActive: false }]);
              setSelectedTypes(prevState => [...prevState, { id: item.Id, name: item.Name, isActive: false }]);
            }
          });
        });
    }
  }, [whatsNextData.data]);

  useEffect(() => {
    setIsLoadingErrorModalVisible(whatsNextData.isError);
  }, [whatsNextData.isError]);

  useEffect(() => {
    setHasFilters([...whatsNextCategories, ...whatsNextTypes].some(value => value.isActive));
    updateQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsNextCategories, whatsNextTypes, sortOrder]);

  useEffect(() => {
    whatsNextData.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const handleOnClearFiltersPress = (setWhatsNextStates: boolean) => {
    if (setWhatsNextStates) {
      setWhatsNextTypes(
        whatsNextTypes.map(item => {
          if (item.isActive === false) {
            return item;
          }
          return {
            id: item.id,
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
            id: item.id,
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
          id: item.id,
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
          id: item.id,
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

  const handleOnSortOrderChange = (value: typeof SORT_NEWEST | typeof SORT_OLDEST) => {
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
          id: item.id,
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

  const handleOnSortingModalPress = () => {
    setIsSortingContentVisible(!isSortingContentVisible);
  };

  const handleOnFiltersModalVisiblePress = () => {
    setSelectedCategories(whatsNextCategories);
    setSelectedTypes(whatsNextTypes);
    setIsFiltersModalVisible(!isFiltersModalVisible);
  };

  const updateQueryParams = () => {
    const whatsNextTypeQuery = whatsNextTypes.filter(data => data.isActive === true).map(data => data.id);
    const whatsNextCategoryQuery = whatsNextCategories.filter(data => data.isActive === true).map(data => data.id);
    const nextQueryParams: Record<string, string> = {};

    if (whatsNextTypeQuery.length > 0) {
      nextQueryParams.WhatsNextTypeId = whatsNextTypeQuery.join(",");
    }

    if (whatsNextCategoryQuery.length > 0) {
      nextQueryParams.WhatsNextCategoryId = whatsNextCategoryQuery.join(",");
    }

    nextQueryParams.Sort = sortOrder;
    setQueryParams(nextQueryParams);
  };

  const handleOnApplyFilterPress = () => {
    setWhatsNextCategories(selectedCategories);
    setWhatsNextTypes(selectedTypes);
    handleOnFiltersModalVisiblePress();
  };

  const handleonRefreshButtonPress = () => {
    setIsLoadingErrorModalVisible(false);
    whatsNextData.refetch();
  };

  const handleOnExploreArticlePress = (articleId: string) => {
    navigation.navigate("WhatsNext.ExploreArticleScreen", { articleId });
  };

  const handleOnTopTenArticlePress = (topTenArticlesData: Content) => {
    navigation.navigate("WhatsNext.TopTenArticleScreen", { topTenArticlesData });
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("WhatsNext.HubScreen.title")}
          end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={handleOnFiltersModalVisiblePress} />}
        />
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        {isLoadingErrorModalVisible && whatsNextData.isError ? (
          <LoadingErrorNotification
            isVisible={isLoadingErrorModalVisible}
            onClose={() => setIsLoadingErrorModalVisible(false)}
            onRefresh={handleonRefreshButtonPress}
          />
        ) : whatsNextData.isError && whatsNextData.isFetching === false ? null : whatsNextData.isFetching ? (
          <FlexActivityIndicator />
        ) : whatsNextData.data !== undefined ? (
          <ContentContainer isScrollView>
            {hasFilters ? (
              <FilterTopBar
                whatsNextTypes={whatsNextTypes}
                whatsNextCategories={whatsNextCategories}
                onTypeFilterItemRemovePress={handleOnTypeFilterItemRemovePress}
                onCategoryFilterItemRemovePress={handleOnCategoryFilterItemRemovePress}
                onClearFiltersPress={() => handleOnClearFiltersPress(true)}
              />
            ) : whatsNextData.data.filter(data => data.ContentTag === TOP10_CONTENT_TAG).length > 0 ? (
              <TopTenSection
                onPress={articleId => {
                  const article = whatsNextData.data.find(d => d.ContentId === articleId);

                  if (article !== undefined) {
                    handleOnTopTenArticlePress(article);
                  }
                }}
                data={whatsNextData.data.filter(data => data.ContentTag === TOP10_CONTENT_TAG) as ArticleSectionType[]}
              />
            ) : null}
            {whatsNextData.data.filter(data => data.ContentTag === EXPLORE_CONTENT_TAG).length !== 0 ? (
              <ExploreSection
                data={
                  whatsNextData.data.filter(data => data.ContentTag === EXPLORE_CONTENT_TAG) as ArticleSectionType[]
                }
                onArticlePress={articleId => {
                  handleOnExploreArticlePress(articleId);
                }}
                onSortByTimePress={handleOnSortingModalPress}
                sortOrder={sortOrder}
              />
            ) : (
              <EmptyArticleListError hasFilters={hasFilters} />
            )}
          </ContentContainer>
        ) : null}
      </Page>
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
