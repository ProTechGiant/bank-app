import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import { RadioButtonGroup } from "@/components/RadioButton";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AddSVG from "../assets/add.svg";
import { FatcaRadioButton, SelectedForeignTaxCountryCard } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useOnboardingBackButton } from "../hooks";
import { useFatcaDetails } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";
import { FatcaFormInput } from "../types";

export default function FatcaDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.Fatca">>();
  const sendFatcaDetails = useFatcaDetails();
  const handleOnBackPress = useOnboardingBackButton();

  const { isLoading, userName } = useOnboardingContext();

  useEffect(() => {
    if (undefined === route.params) return;

    const params = route.params;
    const setOptions = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    if (params.result === "insert" && undefined !== params.element) {
      setValue("ForeignTaxCountry", [...foreignTaxCountries, params.element], setOptions);
    }

    if (params.result === "edit" && undefined !== params.element && undefined !== params.elementIndex) {
      const newElement = params.element;
      const newElementIndex = params.elementIndex;

      setValue(
        "ForeignTaxCountry",
        foreignTaxCountries.map((element, index) => (index === newElementIndex ? newElement : element)),
        setOptions
      );
    }

    if (params.result === "remove" && undefined !== params.elementIndex) {
      const elementIndex = params.elementIndex;

      setValue(
        "ForeignTaxCountry",
        foreignTaxCountries.filter((_, index) => index !== elementIndex),
        setOptions
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  const { control, handleSubmit, setValue, watch, formState } = useForm<FatcaFormInput>({
    mode: "onBlur",
    resolver: yupResolver(foreignTaxResidencySchema),
    defaultValues: {
      ForeignTaxResidencyFlag: undefined,
      ForeignTaxCountry: [],
      PEPFlag: undefined,
    },
  });

  const handleOnChangeHasForeignTaxResidency = (value: boolean) => {
    setValue("ForeignTaxResidencyFlag", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (value === false) {
      setValue("ForeignTaxCountry", [], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleOnAddPress = () => {
    navigation.navigate("Onboarding.CountrySelector", {
      action: "insert",
      disabled: foreignTaxCountries.map(e => e.CountryName),
    });
  };

  const handleOnEditPress = (index: number) => {
    const element = foreignTaxCountries[index];
    if (undefined === element) return;

    navigation.navigate("Onboarding.CountrySelector", {
      element,
      elementIndex: index,
      action: "edit",
      disabled: foreignTaxCountries.map(e => e.CountryName),
    });
  };

  const handleOnSubmit = async (values: FatcaFormInput) => {
    try {
      await sendFatcaDetails.mutateAsync(values);
      navigation.navigate("Onboarding.TermsAndConditions");
    } catch (error) {
      Alert.alert(
        "Sorry, could not complete your request",
        error instanceof ApiError ? error.errorContent.Message : undefined
      );
    }
  };

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  const sectionBreakerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    height: 4,
    backgroundColor: theme.palette["neutralBase-40"],
    marginBottom: theme.spacing["8p"],
  }));

  const hasForeignTaxResidency = watch("ForeignTaxResidencyFlag");
  const areYouPep = watch("PEPFlag");
  const foreignTaxCountries = watch("ForeignTaxCountry");

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        onBackPress={handleOnBackPress}
        title={<ProgressIndicator currentStep={4} totalStep={5} />}
        pageNumber="4/5"
      />
      {isLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <>
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="16p" align="stretch">
              <Stack direction="vertical" gap="4p">
                <Typography.Text size="title3" weight="regular">
                  {t("Onboarding.FatcaDetailsScreen.welcome", {
                    name: userName,
                  })}
                </Typography.Text>
                <Stack direction="vertical" gap="12p">
                  <Typography.Text size="title1" weight="medium">
                    {t("Onboarding.FatcaDetailsScreen.areYouPep")}
                  </Typography.Text>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    {t("Onboarding.FatcaDetailsScreen.pepDescription")}
                  </Typography.Text>
                </Stack>
              </Stack>
              <RadioButtonGroup value={areYouPep} onPress={value => setValue("PEPFlag", value)}>
                <FatcaRadioButton value={true} label={t("Onboarding.FatcaDetailsScreen.yes")} />
                <FatcaRadioButton value={false} label={t("Onboarding.FatcaDetailsScreen.no")} />
              </RadioButtonGroup>
              <View style={sectionBreakerStyle} />
              <Stack direction="vertical" gap="12p">
                <Typography.Text size="title1" weight="medium">
                  {t("Onboarding.FatcaDetailsScreen.title")}
                </Typography.Text>
                <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                  {t("Onboarding.FatcaDetailsScreen.subHeader")}
                </Typography.Text>
              </Stack>
              <RadioButtonGroup
                value={hasForeignTaxResidency}
                onPress={value => handleOnChangeHasForeignTaxResidency(value)}>
                <FatcaRadioButton value={true} label={t("Onboarding.FatcaDetailsScreen.yesIAm")} />
                <FatcaRadioButton value={false} label={t("Onboarding.FatcaDetailsScreen.noIAmNot")} />
              </RadioButtonGroup>
              {foreignTaxCountries.map((country, index) => (
                <SelectedForeignTaxCountryCard
                  key={index}
                  index={index}
                  CountryName={country.CountryName}
                  TaxReferenceNumber={country.TaxReferenceNumber}
                  onPress={handleOnEditPress}
                />
              ))}
              {hasForeignTaxResidency && foreignTaxCountries.length < 3 && !formState.isSubmitting ? (
                <Pressable onPress={handleOnAddPress}>
                  <Stack direction="horizontal" gap="12p" flex={1} align="center">
                    <View>
                      <AddSVG />
                    </View>
                    <Stack direction="vertical" justify="center" flex={1}>
                      <Typography.Text size="callout" weight="regular" color="neutralBase+30" numberOfLines={2}>
                        {t("Onboarding.FatcaDetailsScreen.addCountry")}
                      </Typography.Text>
                      <Typography.Text size="footnote" weight="regular" color="neutralBase">
                        {t("Onboarding.FatcaDetailsScreen.pleaseAtLeastOne")}
                      </Typography.Text>
                    </Stack>
                  </Stack>
                </Pressable>
              ) : null}
            </Stack>
          </ContentContainer>
          <View style={footerStyle}>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="Onboarding.FatcaDetailsScreen:ContinueButton">
              {t("Onboarding.FatcaDetailsScreen.continue")}
            </SubmitButton>
          </View>
        </>
      )}
    </Page>
  );
}

const foreignTaxResidencySchema = yup.object().shape({
  ForeignTaxResidencyFlag: yup.boolean().required(),
  PEPFlag: yup.boolean().required(),
  ForeignTaxCountry: yup.array().when("ForeignTaxResidencyFlag", {
    is: true,
    then: yup
      .array()
      .min(1)
      .of(
        yup.object().shape({
          CountryName: yup.string().required(),
          TaxReferenceNumber: yup.string().required(),
        })
      ),
    otherwise: yup.array().max(0),
  }),
});

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -69,
  },
});
