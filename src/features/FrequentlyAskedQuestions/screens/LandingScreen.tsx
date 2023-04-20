import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { SearchIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import StyledTextInput from "@/components/TextInput";
import Typography from "@/components/Typography";
import { mockFrequentlyAskedQuestions } from "@/mocks/frequentlyAskedQuestionsData";
import { useThemeStyles } from "@/theme";
import { iconMapping } from "@/utils/icon-mapping";

import { LoadingError, Section, SectionsOverview } from "../components";
import { useSearchFAQ } from "../hooks/query-hooks";
import { FAQCategory, FAQData, FAQSection } from "../types";

export default function LandingScreen() {
  const { t } = useTranslation();

  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // TODO: Implement proper language control on integration
  const searchFAQResult = useSearchFAQ(searchQuery, "en");

  useEffect(() => {
    if (mockFrequentlyAskedQuestions === undefined) {
      setShowLoadingErrorModal(true);
    }
  }, []);

  useEffect(() => {
    if (searchFAQResult.isError) {
      setShowLoadingErrorModal(true);
    }
    if (searchFAQResult.isSuccess) {
      setShowLoadingErrorModal(false);
    }
  }, [searchFAQResult.isError, searchFAQResult.isSuccess]);

  const useMergeFaqSections = (data: FAQData) => {
    return useMemo(() => {
      let mergedSections = [] as FAQSection[];

      data.categories.map(d => {
        mergedSections = [...mergedSections, ...d.sections];
      });

      return mergedSections;
    }, [data]);
  };
  const handleOnDismissErrorLoadingPress = () => {
    setShowLoadingErrorModal(false);
  };

  const handleOnRefreshErrorLoadingPress = () => {
    //@TODO refetch API
    handleOnDismissErrorLoadingPress();
  };

  const handleOnChangeText = (text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
  };

  const handleOnCancelPress = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const searchStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["8p"],
  }));

  const searchHelpStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["64p"],
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  }));

  const activeSearchStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["8p"],
    alignItems: "center",
    flexDirection: "row",
  }));

  const searchHelpTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));
  const cancelPressableStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["12p"],
    alignItems: "center",
    flexDirection: "row",
  }));

  const searchIconColor = useThemeStyles(theme => theme.palette.neutralBase);
  const mergedSectionData = useMergeFaqSections(mockFrequentlyAskedQuestions);

  return (
    <Page backgroundColor="neutralBase-60">
      <ScrollView>
        {!isSearching ? <NavHeader /> : null}
        <View style={container}>
          <Stack direction="vertical" gap="16p" align="stretch">
            {!isSearching ? (
              <Typography.Text weight="medium" size="title1">
                {t("FrequentlyAskedQuestions.LandingScreen.title")}
              </Typography.Text>
            ) : null}

            <View style={activeSearchStyle}>
              {/* TODO: Handle overflow properly */}
              <StyledTextInput
                value={searchQuery}
                icon={<SearchIcon />}
                placeholder={t("FrequentlyAskedQuestions.LandingScreen.searchPlaceholder")}
                onPressIn={() => setIsSearching(true)}
                onChangeText={handleOnChangeText}
                isTouched={isSearching}
              />
              {isSearching ? (
                <Pressable style={cancelPressableStyle} onPress={handleOnCancelPress}>
                  <Typography.Text size="callout" weight="regular">
                    Cancel
                  </Typography.Text>
                </Pressable>
              ) : null}
            </View>

            {isSearching && searchQuery === "" ? (
              <View style={searchHelpStyle}>
                <SearchIcon color={searchIconColor} />
                <Typography.Text style={searchHelpTextStyle} size="callout" weight="semiBold">
                  {t("FrequentlyAskedQuestions.LandingScreen.searchHelpTitle")}
                </Typography.Text>
                <Typography.Text style={searchHelpTextStyle} color="neutralBase" size="footnote" weight="regular">
                  {t("FrequentlyAskedQuestions.LandingScreen.searchHelpSubtitle")}
                </Typography.Text>
              </View>
            ) : isSearching && searchFAQResult.data !== undefined ? (
              <View style={searchStyle}>
                <SectionsOverview data={mergedSectionData} faqSearchResponses={searchFAQResult.data} />
              </View>
            ) : !isSearching && !showLoadingErrorModal && mockFrequentlyAskedQuestions?.categories ? (
              mockFrequentlyAskedQuestions.categories.map((data: FAQCategory) => {
                return (
                  <View style={searchStyle} key={data.category_name}>
                    <Section data={data} icon={iconMapping.frequentlyAskedQuestions[data.category_id]} />
                  </View>
                );
              })
            ) : (
              <LoadingError
                isVisible={showLoadingErrorModal}
                onClose={handleOnDismissErrorLoadingPress}
                onRefresh={handleOnRefreshErrorLoadingPress}
              />
            )}
          </Stack>
        </View>
      </ScrollView>
    </Page>
  );
}
