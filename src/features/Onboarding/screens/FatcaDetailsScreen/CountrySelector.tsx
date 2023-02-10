import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { mockCountryList } from "@/mocks/countryListData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { alphaNumericSpaceRegExp } from "@/utils";

import { ForeignTaxCountry } from "./types";

export default function CountrySelector() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.CountrySelector">>();

  const action = route.params.action;
  const countryList = useMemo(() => mockCountryList.sort((a, b) => a.label.localeCompare(b.label)), [mockCountryList]);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        countryName: yup
          .string()
          .required(t("Onboarding.FatcaDetailsScreen.CountrySelector.errorText.countryRequired")),
        taxReferenceNumber: yup
          .string()
          .required(t("Onboarding.FatcaDetailsScreen.CountrySelector.errorText.taxNumberRequired"))
          .matches(alphaNumericSpaceRegExp, t("Onboarding.FatcaDetailsScreen.CountrySelector.errorText.taxRegexFail")),
      }),
    [i18n.language]
  );

  const { control, handleSubmit, setValue } = useForm<ForeignTaxCountry>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      countryName: action === "edit" ? route.params.element?.countryName : undefined,
      taxReferenceNumber: action === "edit" ? route.params.element?.taxReferenceNumber : undefined,
    },
  });

  useEffect(() => {
    if (action === "insert" || undefined === route.params.element) return;

    // mark form dirty
    const element = route.params.element;
    const setOptions = { shouldDirty: true, shouldTouch: true, shouldValidate: true };

    setValue("countryName", element.countryName, setOptions);
    setValue("taxReferenceNumber", element.taxReferenceNumber, setOptions);
  }, [route.params]);

  const handleOnAdd = (values: ForeignTaxCountry) => {
    navigation.navigate("Onboarding.Fatca", {
      result: "insert",
      element: values,
    });
  };

  const handleOnEdit = (values: ForeignTaxCountry) => {
    if (undefined === route.params.elementIndex) return;

    navigation.navigate("Onboarding.Fatca", {
      result: "edit",
      element: values,
      elementIndex: route.params.elementIndex,
    });
  };

  const handleOnRemove = () => {
    if (undefined === route.params.elementIndex) return;

    navigation.navigate("Onboarding.Fatca", {
      result: "remove",
      elementIndex: route.params.elementIndex,
    });
  };

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={t("Onboarding.FatcaDetailsScreen.CountrySelector.navHeaderTitle")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.navigate("Onboarding.Fatca")} />}
        />
        <ContentContainer>
          <Stack align="stretch" direction="vertical" gap="24p">
            <DropdownInput
              autoselect={false}
              control={control}
              fullHeight={true}
              label={t("Onboarding.FatcaDetailsScreen.CountrySelector.countryLabel")}
              name="countryName"
              headerText={t("Onboarding.FatcaDetailsScreen.CountrySelector.dropDownLabel")}
              placeholder={t("Onboarding.FatcaDetailsScreen.CountrySelector.countryPlaceholder")}
              options={countryList.map(country => ({
                value: country.value,
                label: country.label,
                disabled: route.params.disabled?.includes(country.value) ?? false,
              }))}
              buttonLabel={t("Onboarding.FatcaDetailsScreen.CountrySelector.setButton")}
            />
            <TextInput
              control={control}
              showCharacterCount={true}
              name="taxReferenceNumber"
              maxLength={25}
              label={t("Onboarding.FatcaDetailsScreen.CountrySelector.taxNumberLabel")}
              placeholder={t("Onboarding.FatcaDetailsScreen.CountrySelector.taxNumberPlaceholder")}
            />
          </Stack>
        </ContentContainer>
        <View style={footerStyle}>
          <SafeAreaView>
            {action === "insert" ? (
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnAdd)}>
                {t("Onboarding.FatcaDetailsScreen.CountrySelector.addButton")}
              </SubmitButton>
            ) : (
              <Stack align="stretch" direction="vertical" gap="8p">
                <SubmitButton control={control} onSubmit={handleSubmit(handleOnEdit)}>
                  {t("Onboarding.FatcaDetailsScreen.CountrySelector.continue")}
                </SubmitButton>
                <Button variant="secondary" color="alt" onPress={handleOnRemove}>
                  {t("Onboarding.FatcaDetailsScreen.CountrySelector.remove")}
                </Button>
              </Stack>
            )}
          </SafeAreaView>
        </View>
      </Page>
    </SafeAreaProvider>
  );
}
