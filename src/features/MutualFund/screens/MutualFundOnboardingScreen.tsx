import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Dimensions, I18nManager, Platform, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useGetSuitabilityQuestions } from "../hooks/query-hooks";

export default function MutualFundOnboardingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: question, isLoading } = useGetSuitabilityQuestions();
  const [dropdownData, setDropdownData] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
  const [isCurrentPageValid, setIsCurrentPageValid] = useState(false);

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",

    defaultValues: {},
  });
  const watchedValues = watch();

  const dropdownHeight = 125;
  const navHeaderHeight = 40;
  const buttonContainerHeight = 60;

  const calculateDropdownsPerPage = () => {
    const windowHeight = Dimensions.get("window").height;

    const safeAreaAdjustment = Platform.OS === "ios" ? 90 : 0;

    const availableHeight = windowHeight - navHeaderHeight - buttonContainerHeight - safeAreaAdjustment;
    return Math.floor(availableHeight / dropdownHeight);
  };
  const [dropdownsPerPage, setDropdownsPerPage] = useState(calculateDropdownsPerPage());

  const checkCurrentPageValidity = () => {
    const startIndex = currentPage * dropdownsPerPage;
    const endIndex = Math.min(startIndex + dropdownsPerPage, dropdownData.length);
    const currentPageDropdowns = dropdownData.slice(startIndex, endIndex);

    const isPageValid = currentPageDropdowns.every(dropdown => {
      const dropdownValue = watchedValues[`${dropdown.id}`];
      return dropdownValue && dropdownValue.length > 0;
    });

    setIsCurrentPageValid(isPageValid);
  };

  useEffect(() => {
    checkCurrentPageValidity();
  }, [watchedValues, currentPage, dropdownData, dropdownsPerPage]);

  useEffect(() => {
    if (dropdownData.length > 0) {
      const schemaFields = dropdownData.reduce((acc, item) => {
        acc[`${item.id}`] = yup.string().required();
        return acc;
      }, {});

      const newValidationSchema = yup.object().shape(schemaFields);
      setValidationSchema(newValidationSchema);
    }
  }, [dropdownData]);

  useEffect(() => {
    if (question?.Template?.Questions) {
      const filteredQuestions = question.Template.Questions.filter(q => q.Id !== 4);

      const processedData = filteredQuestions.map(q => ({
        title: I18nManager.isRTL ? q.ArabicTitle : q.EnglishTitle,
        options: q.Options.map(option => {
          return {
            label: I18nManager.isRTL ? option.ArabicLabel : option.EnglishLabel,
            value: option.Value,
          };
        }),
        id: q.Id,
      }));
      setDropdownData(processedData);

      const newTotalDropdowns = processedData.length;
      setTotalPages(Math.ceil(newTotalDropdowns / dropdownsPerPage));
    }
  }, [question, dropdownsPerPage]);

  useEffect(() => {
    const updateLayout = () => {
      const newDropdownsPerPage = calculateDropdownsPerPage();
      setDropdownsPerPage(newDropdownsPerPage);
    };

    const subscription = Dimensions.addEventListener("change", updateLayout);
    updateLayout();

    return () => subscription.remove();
  }, []);

  const renderDropdownsForPage = () => {
    const startIndex = currentPage * dropdownsPerPage;
    const endIndex = Math.min(startIndex + dropdownsPerPage, dropdownData.length);

    return dropdownData.slice(startIndex, endIndex).map(item => (
      <View style={{ marginVertical: Platform.OS === "ios" ? 17 : 10 }} key={item.id}>
        <DropdownInput
          isFixedHeight={true}
          control={control}
          name={`${item.id}`}
          label={item.title}
          placeholder={item.title}
          options={item.options}
          buttonLabel={t("Settings.FinancialInformation.selectButton")}
          variant="small"
          autoselect
        />
      </View>
    ));
  };

  const handleOnSubmit = () => {
    navigation.navigate("MutualFund.RiskAppetiteScreen", { totalPages });
  };

  const progressIndictorStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    top: -theme.spacing["24p"],
    width: "80%",
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: theme.spacing["4p"],
    padding: theme.spacing["12p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["20p"],
  }));

  return isLoading ? (
    <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />
  ) : (
    <Page
      backgroundColor="neutralBase-60"
      insets={["left", "right", "bottom", "top"]}
      testID="MutualFund.Onboarding:Page">
      <NavHeader
        title=""
        testID="MutualFund.Onboarding:NavHeader"
        onBackPress={currentPage > 0 ? () => setCurrentPage(currentPage - 1) : () => navigation.goBack()}>
        <View style={progressIndictorStyle}>
          <ProgressIndicator currentStep={currentPage + 1} totalStep={totalPages + 1} />
        </View>
        <Stack direction="vertical" align="center" gap="12p" testID="MutualFund.Onboarding:Stack">
          <Typography.Text size="title3" weight="medium">
            {t("MutualFund.Onboarding.onboardingTitle")}
          </Typography.Text>
        </Stack>
      </NavHeader>

      <View style={mainContainerStyle}>
        {renderDropdownsForPage()}

        <View style={buttonContainerStyle}>
          {currentPage < totalPages - 1 ? (
            <Button
              onPress={() => setCurrentPage(currentPage + 1)}
              disabled={!isCurrentPageValid}
              testID="MutualFund.Onboarding-Next:Button">
              {t("MutualFund.Onboarding.confirmButton")}
            </Button>
          ) : (
            <SubmitButton
              onSubmit={handleSubmit(handleOnSubmit)}
              control={control}
              testID="MutualFund.Onboarding-Confirm:SubmitButton">
              {t("MutualFund.Onboarding.confirmButton")}
            </SubmitButton>
          )}
        </View>
      </View>
    </Page>
  );
}
