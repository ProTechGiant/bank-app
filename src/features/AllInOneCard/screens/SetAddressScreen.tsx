import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, TextStyle, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address } from "@/types/CustomerProfile";
import { alphaNumericSpecialCharsRegExp } from "@/utils";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { useCities } from "../hooks/query-hooks";

export default function SetAddressScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.SetAddressScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data } = useCities({ countryCode: "KSA" });
  const cities = data?.CitiesList ? data.CitiesList : [];

  const validationSchema = useMemo(
    () =>
      Yup.object({
        BuildingNumber: Yup.string()
          .trim()
          .required(t("AllInOneCard.SetAddressScreen.form.buildingNumber.validation.required"))
          .matches(
            alphaNumericSpecialCharsRegExp,
            t("AllInOneCard.SetAddressScreen.form.buildingNumber.validation.invalid")
          ),
        StreetName: Yup.string()
          .trim()
          .required(t("AllInOneCard.SetAddressScreen.form.street.validation.required"))
          .matches(alphaNumericSpecialCharsRegExp, t("AllInOneCard.SetAddressScreen.form.street.validation.invalid")),
        District: Yup.string()
          .trim()
          .required(t("AllInOneCard.SetAddressScreen.form.district.validation.required"))
          .matches(alphaNumericSpecialCharsRegExp, t("AllInOneCard.SetAddressScreen.form.district.validation.invalid")),
        CityCode: Yup.string().required(t("AllInOneCard.SetAddressScreen.form.district.validation.required")),
        Postcode: Yup.string()
          .matches(/^\d+$/, {
            message: t("AllInOneCard.SetAddressScreen.form.postalCode.validation.minLength"),
            excludeEmptyString: true,
          })
          .required(t("AllInOneCard.SetAddressScreen.form.postalCode.validation.required")),
      }),
    [t]
  );

  const initialAddress = {
    BuildingNumber: "",
    StreetName: "",
    District: "",
    CityCode: "",
    Postcode: "",
  };
  const address = route.params?.address ? route.params.address : initialAddress;

  const { control, handleSubmit, setValue } = useForm<Address>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      BuildingNumber: address?.BuildingNumber,
      StreetName: address?.StreetName,
      District: address?.District,
      CityCode: address?.CityCode,
      Postcode: address?.Postcode,
    },
  });

  const ReviewAddress = (values: Address) => {
    const newAddress = {
      ...address,
      ...values,
      CityCode: values.CityCode,
    };
    navigation.navigate("AllInOneCard.SummaryAddressScreen", { address: newAddress });
  };

  const subTitleStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" testID="AllInOneCard.SetAddressScreen:Page">
        <NavHeader testID="AllInOneCard.SetAddressScreen:NavHeader" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.containerStyle}>
          <ContentContainer isScrollView>
            <View style={styles.containerStyle}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("AllInOneCard.SetAddressScreen.title")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={subTitleStyle}>
                {t("AllInOneCard.SetAddressScreen.subTitle")}
              </Typography.Text>
              <Stack direction="vertical" align="stretch" gap="20p">
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.buildingNumber.label")}
                  name="BuildingNumber"
                  maxLength={50}
                  onClear={() => setValue("BuildingNumber", "")}
                  testID="AllInOneCard.SetAddressScreen:BuildingNumber"
                />
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.street.label")}
                  name="StreetName"
                  maxLength={50}
                  onClear={() => setValue("StreetName", "")}
                  testID="AllInOneCard.SetAddressScreen:AddressLineTwoInput"
                />
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.district.label")}
                  name="District"
                  maxLength={50}
                  onClear={() => setValue("District", "")}
                  testID="AllInOneCard.SetAddressScreen:DistrictInput"
                />
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.postalCode.label")}
                  name="Postcode"
                  keyboardType="number-pad"
                  maxLength={5}
                  onClear={() => setValue("Postcode", "")}
                  testID="AllInOneCard.SetAddressScreen:PostalCodeInput"
                  showCharacterCount
                />
                <DropdownInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.city.label")}
                  name="CityCode"
                  placeholder={t("AllInOneCard.SetAddressScreen.form.city.placeholder")}
                  headerText={t("AllInOneCard.SetAddressScreen.form.city.dropdownHeader")}
                  options={cities?.map(city => ({ value: city.CityName, label: city.CityName }))}
                  buttonLabel={t("AllInOneCard.SetAddressScreen.form.city.buttonLabel")}
                  testID="AllInOneCard.SetAddressScreen:CityDropdownInput"
                />
              </Stack>
            </View>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(ReviewAddress)}
              testID="AllInOneCard.SetAddressScreen:ReviewAddressButton">
              {t("AllInOneCard.SetAddressScreen.form.button")}
            </SubmitButton>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});
