import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";

import NoInternetIcon from "@/assets/icons/NoInternetIcon";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { NoResultsIcon, SearchFaqIcon } from "../assets/icons";
import { FAQListPreview, SearchLoader, Section } from "../components";
import { useSearchFAQ } from "../hooks/query-hooks";
import { FAQData } from "../types";

export default function LandingScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const { height } = useWindowDimensions();

  const { data, refetch, isError, isFetching } = useSearchFAQ(searchQuery.trim(), i18n.language);
  useEffect(() => {
    setShowLoadingErrorModal(isError);
  }, [isError]);

  useEffect(() => {
    const debounceId = setTimeout(() => {
      setSearchQuery(searchText);
    }, 1000);
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

  const searchHelpTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));
  const searchHelpSupportStyle = useThemeStyles<TextStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
    textDecorationLine: "underline",
  }));
  const loadingStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop:
      height / 4 - // calculation to get 25% of screen height
      theme.spacing["20p"], // remove ContentContainer Padding
    paddingHorizontal: theme.spacing["16p"],
  }));

  const statusBarColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["left", "right"]} backgroundColor="neutralBase-40">
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      {!isFocused && (
        <NavHeader variant="angled" backgroundAngledColor={NavHeaderColor}>
          <NavHeader.BoldTitle color="neutralBase-60">
            {t("FrequentlyAskedQuestions.LandingScreen.title")}
          </NavHeader.BoldTitle>
          <SearchInput
            onClear={handleOnCancelPress}
            onSearch={handleOnChangeText}
            placeholder={t("FrequentlyAskedQuestions.LandingScreen.searchPlaceholder")}
            value={searchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </NavHeader>
      )}
      <StatusBar barStyle="light-content" backgroundColor={statusBarColor} translucent />
      {isFetching ? (
        <View style={loadingStyle}>
          <SearchLoader />
        </View>
      ) : (
        <>
          {isFocused && (
            <NavHeader variant="angled" withBackButton={false}>
              <Stack direction="horizontal" gap="8p" align="center">
                <View style={styles.activeSearchStyle}>
                  <SearchInput
                    onClear={handleOnCancelPress}
                    onSearch={handleOnChangeText}
                    placeholder={t("FrequentlyAskedQuestions.LandingScreen.searchPlaceholder")}
                    value={searchText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </View>
                <Pressable onPress={() => setIsFocused(false)}>
                  <Typography.Text color="neutralBase-60">
                    {t("FrequentlyAskedQuestions.LandingScreen.cancel")}
                  </Typography.Text>
                </Pressable>
              </Stack>
            </NavHeader>
          )}
          <ContentContainer isScrollView>
            <Stack direction="vertical" align="stretch" style={styles.internalContentContainer}>
              {isError && (
                <View style={[styles.errormessageContainerStyle, loadingStyle]}>
                  <NoInternetIcon />
                  <Typography.Text size="callout" weight="medium" align="center" style={styles.errorTextStyle}>
                    {t("FrequentlyAskedQuestions.LandingScreen.noNetworkAvailable")}
                  </Typography.Text>
                  <Typography.Text size="footnote" weight="regular" align="center" style={styles.errorTextStyle}>
                    {t("FrequentlyAskedQuestions.LandingScreen.checkInternet")}
                  </Typography.Text>
                </View>
              )}

              {showLoadingErrorModal ? (
                <>
                  <LoadingErrorNotification
                    isVisible={showLoadingErrorModal}
                    onClose={() => setShowLoadingErrorModal(false)}
                    onRefresh={refetch}
                  />
                </>
              ) : isFocused && searchText === "" ? (
                <View style={styles.searchHelpStyle}>
                  <SearchFaqIcon />
                  <View style={styles.searchHelpStyleTextContainer}>
                    <Typography.Text
                      align="center"
                      style={searchHelpTextStyle}
                      size="callout"
                      weight="medium"
                      color="neutralBase+30">
                      {t("FrequentlyAskedQuestions.LandingScreen.searchHelpTitle")}
                    </Typography.Text>
                    <Typography.Text
                      style={searchHelpTextStyle}
                      size="footnote"
                      weight="regular"
                      align="center"
                      color="neutralBase-10">
                      {t("FrequentlyAskedQuestions.LandingScreen.searchHelpSubtitle")}
                    </Typography.Text>
                  </View>
                </View>
              ) : isFocused && data?.length === 0 && searchText !== "" ? (
                <View style={styles.searchHelpStyle}>
                  <NoResultsIcon />
                  <View style={styles.searchHelpStyleTextContainer}>
                    <Typography.Text
                      align="center"
                      style={searchHelpTextStyle}
                      size="callout"
                      weight="medium"
                      color="neutralBase+30">
                      {t("FrequentlyAskedQuestions.LandingScreen.troubleFindingAnswer")}
                    </Typography.Text>
                    <Typography.Text
                      style={searchHelpSupportStyle}
                      size="footnote"
                      weight="regular"
                      align="center"
                      color="complimentBase">
                      {t("FrequentlyAskedQuestions.LandingScreen.contactSupport")}
                    </Typography.Text>
                  </View>
                </View>
              ) : data !== undefined && searchText !== "" && searchText === searchQuery ? (
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
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  activeSearchStyle: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  errorTextStyle: {
    width: "70%",
  },

  errormessageContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  internalContentContainer: {
    flex: 1,
  },
  searchHelpStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  searchHelpStyleTextContainer: {
    alignItems: "center",
    width: "70%",
  },
});
