import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";

import { SearchIcon } from "@/assets/icons";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { mockFrequentlyAskedQuestions } from "@/mocks/frequentlyAskedQuestionsData";
import { useThemeStyles } from "@/theme";
import { iconMapping } from "@/utils/icon-mapping";

import { LoadingError, Section } from "../components";

interface Search {
  searchString: string;
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { control } = useForm<Search>({});
  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);

  useEffect(() => {
    if (mockFrequentlyAskedQuestions === undefined) {
      setShowLoadingErrorModal(true);
    }
  }, [mockFrequentlyAskedQuestions]);

  const handleOnDismissErrorLoadingPress = () => {
    setShowLoadingErrorModal(false);
  };

  const handleOnRefreshErrorLoadingPress = () => {
    //@TODO refetch API
    handleOnDismissErrorLoadingPress();
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const searchStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <ScrollView>
        <NavHeader />
        <View style={container}>
          <Stack direction="vertical" gap="16p" align="stretch">
            <Typography.Text weight="medium" size="title1">
              {t("FrequentlyAskedQuestions.LandingPage.title")}
            </Typography.Text>
            <View style={searchStyle}>
              <TextInput
                name="searchString"
                icon={<SearchIcon />}
                control={control}
                placeholder={t("FrequentlyAskedQuestions.LandingPage.searchPlaceholder")}
              />
            </View>
            {mockFrequentlyAskedQuestions?.categories ? (
              mockFrequentlyAskedQuestions.categories.map((data, i) => {
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
