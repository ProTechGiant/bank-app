import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { InfoIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import EmptyListIcon from "../assets/icons/no-ewards-yet.svg";
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

  const activeSearchStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  }));

  const searchHelpTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));

  const statusBarColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page>
      {!isFocused && (
        <NavHeader variant="angled" showStatusBar={false}>
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
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <>
          {isFocused && (
            <NavHeader variant="angled" withBackButton={false} showStatusBar={false}>
              <Stack direction="horizontal" gap="8p" align="center">
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
                <View style={styles.searchHelpStyle}>
                  <EmptyListIcon />
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
  errormessageContainerStyle: {
    alignItems: "center",
  },
  internalContentContainer: {
    flex: 1,
  },
  loading: {
    flex: 1,
    marginTop: -49,
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
