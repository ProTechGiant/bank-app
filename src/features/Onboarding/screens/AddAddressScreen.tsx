import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, ViewStyle } from "react-native";
import * as yup from "yup";

import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { arabicCityNames, englishCityNames } from "../mock/cityNames";
import { OnboardingStackParams } from "../OnboardingStack";
import { AddressInterface } from "../types";

const schema = yup.object({
  StreetName: yup.string().min(1, "Street name must be at least 1 characters"),
  City: yup.string().min(1, "City must be at least 1 characters"),
  District: yup.string().min(1, "District must be at least 1 characters"),
  BuildingNumber: yup.string().min(1, "Building number must be at least 1 characters"),
  PostCode: yup.string().min(1, "Post code must be at least 1 characters"),
});

export default function AddAddressScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { t, i18n } = useTranslation();
  const { addressData, setAddressData } = useOnboardingContext();

  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.AddAddress">>();

  const { control, handleSubmit, setValue } = useForm<AddressInterface>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      StreetName: addressData?.StreetName ?? "",
      City: addressData?.City ?? "",
      District: addressData?.District ?? "",
      BuildingNumber: addressData?.BuildingNumber ?? "",
      UnitNumber: addressData?.UnitNumber ?? "",
      PostCode: addressData?.PostCode ?? "",
      AdditionalNumber: addressData?.AdditionalNumber ?? "",
    },
  });

  const handleOnSubmit = (values: AddressInterface) => {
    setAddressData({ ...addressData, ...values });
    navigation.goBack();
  };

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["12p"],
    marginTop: theme.spacing["12p"],
  }));

  const inputSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginTop: theme.spacing["16p"],
    alignItems: "stretch",
  }));

  const cityContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginTop: theme.spacing["24p"],
    alignItems: "stretch",
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} />
      <ScrollView contentContainerStyle={mainContainerStyle}>
        <Typography.Text size="title1" weight="medium">
          {t("Onboarding.AddAddressScreen.title")}
        </Typography.Text>

        <Stack direction="vertical" gap="8p" style={cityContainerStyle}>
          <DropdownInput
            pointerEvents={route.params.isCityEditable ? undefined : "none"}
            isEditable={route.params.isCityEditable}
            control={control}
            name="City"
            label={t("Onboarding.AddAddressScreen.inputCityLabel")}
            placeholder="Please select your city"
            options={i18n.language.toUpperCase() === "EN" ? englishCityNames : arabicCityNames}
            variant="small"
            buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
            autoselect
            testID="Onboarding.AddAddressScreen:City"
          />
        </Stack>
        <Stack direction="vertical" gap="8p" style={inputSectionStyle}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            control={control}
            name="District"
            label={t("Onboarding.AddAddressScreen.inputDistrictLabel")}
            onClear={() => setValue("District", "")}
            testID="Onboarding.AddAddressScreen:EmailInput"
          />
        </Stack>
        <Stack direction="vertical" gap="8p" style={inputSectionStyle}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            control={control}
            name="StreetName"
            label={t("Onboarding.AddAddressScreen.street")}
            onClear={() => setValue("StreetName", "")}
            testID="Onboarding.AddAddressScreen:EmailInput"
          />
        </Stack>
        <Stack direction="vertical" gap="8p" style={inputSectionStyle}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            control={control}
            name="BuildingNumber"
            label={t("Onboarding.AddAddressScreen.buildingNumber")}
            onClear={() => setValue("BuildingNumber", "")}
            testID="Onboarding.AddAddressScreen:EmailInput"
          />
        </Stack>
        <Stack direction="vertical" gap="8p" style={inputSectionStyle}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            control={control}
            name="PostCode"
            label={t("Onboarding.AddAddressScreen.postalCode")}
            onClear={() => setValue("PostCode", "")}
            testID="Onboarding.AddAddressScreen:EmailInput"
          />
        </Stack>
        <Stack direction="vertical" gap="8p" style={inputSectionStyle}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            control={control}
            name="AdditionalNumber"
            label={t("Onboarding.AddAddressScreen.additionalNumber")}
            onClear={() => setValue("AdditionalNumber", "")}
            testID="Onboarding.AddAddressScreen:EmailInput"
          />
        </Stack>
      </ScrollView>
      <Stack align="stretch" direction="vertical" style={footerStyle}>
        <SubmitButton
          control={control}
          onSubmit={handleSubmit(handleOnSubmit)}
          testID="Onboarding.AddAddressScreen:ContinueButton">
          {t("Onboarding.AddAddressScreen.buttonTitle")}
        </SubmitButton>
      </Stack>
    </Page>
  );
}
