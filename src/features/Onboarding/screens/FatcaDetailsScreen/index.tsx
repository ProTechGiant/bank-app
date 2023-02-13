import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, SafeAreaView, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import MoreInfoDropdown from "../../components/MoreInfoDropdown";
import { OnboardingStackParams } from "../../OnboardingStack";
import ApiOnboardingError from "../../types/ApiOnboardingError";
import AddCountryTile from "./AddCountryTile";
import SelectedForeignTaxCountryCard from "./SelectedForeignTaxCountryCard";
import { FatcaFormInput, ForeignTaxCountry } from "./types";
import useFatcaDetails from "./use-fatca-details";

export default function FatcaDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.Fatca">>();
  const sendFatcaDetails = useFatcaDetails();

  useEffect(() => {
    if (undefined === route.params) return;

    const params = route.params;
    const setOptions = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    if (params.result === "insert" && undefined !== params.element) {
      setValue("foreignTaxCountry", [...foreignTaxCountries, params.element], setOptions);
    }

    if (params.result === "edit" && undefined !== params.element && undefined !== params.elementIndex) {
      const newElement = params.element as ForeignTaxCountry;
      const newElementIndex = params.elementIndex as number;

      setValue(
        "foreignTaxCountry",
        foreignTaxCountries.map((element, index) => (index === newElementIndex ? newElement : element)),
        setOptions
      );
    }

    if (params.result === "remove" && undefined !== params.elementIndex) {
      const elemementIndex = params.elementIndex as number;

      setValue(
        "foreignTaxCountry",
        foreignTaxCountries.filter((_, index) => index !== elemementIndex),
        setOptions
      );
    }
  }, [route.params]);

  const { control, handleSubmit, setValue, watch } = useForm<FatcaFormInput>({
    mode: "onBlur",
    resolver: yupResolver(foreignTaxResidencySchema),
    defaultValues: {
      foreignTaxResidencyFlag: undefined,
      foreignTaxCountry: [],
    },
  });

  const handleOnChangeHasForeignTaxResidency = (value: boolean) => {
    setValue("foreignTaxResidencyFlag", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (false === value) {
      setValue("foreignTaxCountry", [], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleOnAddPress = () => {
    navigation.navigate("Onboarding.CountrySelector", {
      action: "insert",
      disabled: foreignTaxCountries.map(e => e.countryName),
    });
  };

  const handleOnEditPress = (index: number) => {
    const element = foreignTaxCountries[index];
    if (undefined === element) return;

    navigation.navigate("Onboarding.CountrySelector", {
      element,
      elementIndex: index,
      action: "edit",
      disabled: foreignTaxCountries.map(e => e.countryName),
    });
  };

  const handleOnSubmit = async (values: FatcaFormInput) => {
    navigation.navigate("Onboarding.TermsAndConditions");
    // waiting for PC-5349 development to be completed
    // try {
    //   console.log(values); // !TODO remove once BE api is complete

    //   await sendFatcaDetails.mutateAsync(values);
    //   navigation.navigate("Onboarding.TermsAndConditions");
    // } catch (error) {
    //   Alert.alert(
    //     "Sorry, could not complete your request",
    //     error instanceof ApiError<ApiOnboardingError> ? error.errorContent.Message : undefined
    //   );
    // }
  };

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const hasForeignTaxResidency = watch("foreignTaxResidencyFlag");
  const foreignTaxCountries = watch("foreignTaxCountry");

  return (
    <Page>
      <NavHeader title={t("Onboarding.FatcaDetailsScreen.navHeaderTitle")} withBackButton={false}>
        <ProgressIndicator currentStep={4} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
          <Stack direction="vertical" gap="16p" align="stretch">
            <Typography.Header size="medium" weight="bold">
              {t("Onboarding.FatcaDetailsScreen.title")}
            </Typography.Header>
            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("Onboarding.FatcaDetailsScreen.subHeader")}
            </Typography.Text>
            <Stack direction="horizontal" gap="32p" justify="space-evenly">
              <View style={{ flex: 1 }}>
                <Button
                  variant={true === hasForeignTaxResidency ? "primary" : "secondary"}
                  onPress={() => handleOnChangeHasForeignTaxResidency(true)}>
                  {t("Onboarding.FatcaDetailsScreen.yes")}
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  variant={false === hasForeignTaxResidency ? "primary" : "secondary"}
                  onPress={() => handleOnChangeHasForeignTaxResidency(false)}>
                  {t("Onboarding.FatcaDetailsScreen.no")}
                </Button>
              </View>
            </Stack>
            <MoreInfoDropdown title={t("Onboarding.FatcaDetailsScreen.moreInfoDropdownTitle")}>
              <Typography.Text color="neutralBase" size="footnote">
                {t("Onboarding.FatcaDetailsScreen.moreInfoDropdownBody")}
              </Typography.Text>
            </MoreInfoDropdown>
            {foreignTaxCountries.map((country, index) => (
              <SelectedForeignTaxCountryCard
                key={index}
                index={index}
                countryName={country.countryName}
                taxReferenceNumber={country.taxReferenceNumber}
                onPress={handleOnEditPress}
              />
            ))}
            {hasForeignTaxResidency && foreignTaxCountries.length < 3 && <AddCountryTile onPress={handleOnAddPress} />}
          </Stack>
        </ContentContainer>
      </ScrollView>
      <View style={footerStyle}>
        <SafeAreaView>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("Onboarding.FatcaDetailsScreen.continue")}
          </SubmitButton>
        </SafeAreaView>
      </View>
    </Page>
  );
}

const foreignTaxResidencySchema = yup.object().shape({
  foreignTaxResidencyFlag: yup.boolean().required(),
  foreignTaxCountry: yup.array().when("foreignTaxResidencyFlag", {
    is: true,
    then: yup
      .array()
      .min(1)
      .of(
        yup.object().shape({
          countryName: yup.string().required(),
          taxReferenceNumber: yup.string().required(),
        })
      ),
    otherwise: yup.array().max(0),
  }),
});
