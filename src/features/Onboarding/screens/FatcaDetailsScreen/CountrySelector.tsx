import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
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
import { alphaNumericRegExp } from "@/utils";

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
        CountryName: yup
          .string()
          .required(t("Onboarding.FatcaDetailsScreen.CountrySelector.errorText.countryRequired")),
        TaxReferenceNumber: yup
          .string()
          .required(t("Onboarding.FatcaDetailsScreen.CountrySelector.errorText.taxNumberRequired"))
          .matches(alphaNumericRegExp, t("Onboarding.FatcaDetailsScreen.CountrySelector.errorText.taxNumberInvalid")),
      }),
    [i18n.language]
  );

  const { control, handleSubmit } = useForm<ForeignTaxCountry>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      CountryName: action === "edit" ? route.params.element?.CountryName : undefined,
      TaxReferenceNumber: action === "edit" ? route.params.element?.TaxReferenceNumber : undefined,
    },
  });

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
        <ContentContainer isScrollView>
          <Stack align="stretch" direction="vertical" gap="24p">
            <DropdownInput
              autoselect={false}
              control={control}
              fullHeight={true}
              label={t("Onboarding.FatcaDetailsScreen.CountrySelector.countryLabel")}
              name="CountryName"
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
              name="TaxReferenceNumber"
              maxLength={25}
              keyboardType="default"
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
                <SubmitButton allowPristine control={control} onSubmit={handleSubmit(handleOnEdit)}>
                  {t("Onboarding.FatcaDetailsScreen.CountrySelector.updateButton")}
                </SubmitButton>
                <Button variant="warning" color="dark" onPress={handleOnRemove}>
                  {t("Onboarding.FatcaDetailsScreen.CountrySelector.removeButton")}
                </Button>
              </Stack>
            )}
          </SafeAreaView>
        </View>
      </Page>
    </SafeAreaProvider>
  );
}
