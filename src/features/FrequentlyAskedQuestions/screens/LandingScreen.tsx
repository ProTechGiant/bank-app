import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { InfoIcon, SearchIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { FAQListPreview, Section } from "../components";
import { useSearchFAQ } from "../hooks/query-hooks";
import { FAQData } from "../types";

export default function LandingScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const { data, refetch, isError, isFetching } = useSearchFAQ(searchQuery.trim(), i18n.language);

  useEffect(() => {
    setShowLoadingErrorModal(isError);
  }, [isError]);

  useEffect(() => {
    const debounceId = setTimeout(() => {
      setSearchQuery(searchText);
    }, 1500);
    return () => clearTimeout(debounceId);
  }, [searchText]);

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchText === "") return;
    else setSearchText(text);
  };

  const handleOnCancelPress = () => {
    setSearchText("");
    setIsFocused(false);
  };

  const handleFAQOnPress = (faqId: string) => {
    navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { faqId });
  };

  const handleSectionOnPress = (sectionSdata: FAQData, title: string) => {
    navigation.navigate("FrequentlyAskedQuestions.SectionScreen", { data: sectionSdata, title });
  };

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
    flex: 1,
  }));

  const searchHelpTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));

  const searchIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <Page>
      {!isFocused && <NavHeader />}
      {isFetching ? (
        <FlexActivityIndicator />
      ) : (
        <ContentContainer isScrollView>
          <Stack direction="vertical" gap="16p" align="stretch">
            {!isFocused && (
              <Typography.Text weight="medium" size="title1">
                {t("FrequentlyAskedQuestions.LandingScreen.title")}
              </Typography.Text>
            )}
            <View style={activeSearchStyle}>
              <SearchInput
                onClear={handleOnCancelPress}
                onSearch={handleOnChangeText}
                placeholder={t("FrequentlyAskedQuestions.LandingScreen.searchPlaceholder")}
                value={searchText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
            {showLoadingErrorModal ? (
              <>
                <View style={styles.errormessageContainerStyle}>
                  <InfoIcon />
                  <Typography.Text size="callout" weight="regular">
                    {t("FrequentlyAskedQuestions.LandingScreen.couldNottLoadData")}
                  </Typography.Text>
                  <Typography.Text size="footnote" weight="regular">
                    {t("FrequentlyAskedQuestions.LandingScreen.plesetryLater")}
                  </Typography.Text>
                </View>
                <LoadingErrorNotification
                  isVisible={showLoadingErrorModal}
                  onClose={() => setShowLoadingErrorModal(false)}
                  onRefresh={refetch}
                />
              </>
            ) : isFocused && searchText === "" ? (
              <View style={searchHelpStyle}>
                <SearchIcon color={searchIconColor} />
                <Typography.Text style={searchHelpTextStyle} size="callout" weight="semiBold">
                  {t("FrequentlyAskedQuestions.LandingScreen.searchHelpTitle")}
                </Typography.Text>
                <Typography.Text style={searchHelpTextStyle} color="neutralBase" size="footnote" weight="regular">
                  {t("FrequentlyAskedQuestions.LandingScreen.searchHelpSubtitle")}
                </Typography.Text>
              </View>
            ) : data !== undefined && searchText !== "" ? (
              <FAQListPreview data={data} onPress={handleFAQOnPress} />
            ) : (
              data &&
              data.map((item, index) => {
                return (
                  <View key={index} style={searchStyle}>
                    <Section data={item} onPress={handleSectionOnPress} />
                  </View>
                );
              })
            )}
          </Stack>
        </ContentContainer>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  errormessageContainerStyle: {
    alignItems: "center",
  },
});
