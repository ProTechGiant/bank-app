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
import { alphaNumericSpecialCharsRegExp } from "@/utils";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { CITIES } from "../mocks";
import { Address } from "../types";

export default function SetAddressScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.SetAddressScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();

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
        Street: Yup.string()
          .trim()
          .required(t("AllInOneCard.SetAddressScreen.form.street.validation.required"))
          .matches(alphaNumericSpecialCharsRegExp, t("AllInOneCard.SetAddressScreen.form.street.validation.invalid")),
        District: Yup.string()
          .trim()
          .required(t("AllInOneCard.SetAddressScreen.form.district.validation.required"))
          .matches(alphaNumericSpecialCharsRegExp, t("AllInOneCard.SetAddressScreen.form.district.validation.invalid")),
        City: Yup.string().required(t("AllInOneCard.SetAddressScreen.form.district.validation.required")),
        PostalCode: Yup.string().required(t("AllInOneCard.SetAddressScreen.form.postalCode.validation.required")),
      }),
    [t]
  );

  const initialAddress = {
    BuildingNumber: "",
    Street: "",
    District: "",
    City: "",
    PostalCode: "",
  };
  const address = route.params?.address ? route.params.address : initialAddress;

  const { control, handleSubmit } = useForm<Address>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      BuildingNumber: address?.BuildingNumber,
      Street: address?.Street,
      District: address?.District,
      City: address?.City,
      PostalCode: address?.PostalCode,
    },
  });

  const ReviewAddress = (values: Address) => {
    navigation.navigate("AllInOneCard.SummaryAddressScreen", { address: values });
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
                  testID="AllInOneCard.SetAddressScreen:BuildingNumber"
                />
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.street.label")}
                  name="Street"
                  maxLength={50}
                  testID="AllInOneCard.SetAddressScreen:AddressLineTwoInput"
                />
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.district.label")}
                  name="District"
                  maxLength={50}
                  testID="AllInOneCard.SetAddressScreen:DistrictInput"
                />
                <TextInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.postalCode.label")}
                  name="PostalCode"
                  keyboardType="number-pad"
                  maxLength={5}
                  testID="AllInOneCard.SetAddressScreen:PostalCodeInput"
                  showCharacterCount
                />
                <DropdownInput
                  control={control}
                  label={t("AllInOneCard.SetAddressScreen.form.city.label")}
                  name="City"
                  headerText={t("AllInOneCard.SetAddressScreen.form.city.dropdownHeader")}
                  placeholder={t("AllInOneCard.SetAddressScreen.form.city.placeholder")}
                  options={CITIES.map(city => ({ value: city, label: city }))}
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
