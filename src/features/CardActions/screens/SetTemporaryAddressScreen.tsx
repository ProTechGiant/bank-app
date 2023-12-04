import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from "react-native";
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
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address } from "@/types/Address";
import { alphaNumericSpecialCharsRegExp } from "@/utils";

export default function SetTemporaryAddressScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.SetTemporaryAddressScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        AddressLineOne: Yup.string()
          .trim()
          .required(t("CardActions.SetTemporaryAddressScreen.form.addressLineOne.validation.required"))
          .matches(
            alphaNumericSpecialCharsRegExp,
            t("CardActions.SetTemporaryAddressScreen.form.addressLineOne.validation.invalid")
          )
          .min(5, t("CardActions.SetTemporaryAddressScreen.form.addressLineOne.validation.minLength")),
        District: Yup.string().required(t("CardActions.SetTemporaryAddressScreen.form.district.validation.required")),
        City: Yup.string().required(t("CardActions.SetTemporaryAddressScreen.form.city.validation.required")),
        PostalCode: Yup.string()
          .required(t("CardActions.SetTemporaryAddressScreen.form.postalCode.validation.required"))
          .min(5, t("CardActions.SetTemporaryAddressScreen.form.postalCode.validation.minLength")),
      }),
    [t]
  );

  const address = route.params.initialValue;
  const { control, handleSubmit, setValue, getValues } = useForm<Address>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      AddressLineOne: address?.AddressLineOne,
      AddressLineTwo: address?.AddressLineTwo,
      District: address?.District,
      City: address?.City,
      PostalCode: address?.PostalCode,
    },
  });

  const handleOnSubmit = (values: Address) => {
    navigation.navigate(route.params.navigateTo, {
      alternativeAddress: values,
    });
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopColor: theme.palette["neutralBase-20"],
    paddingTop: theme.spacing["20p"],
    paddingBottom: theme.spacing["20p"],
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing["16p"],
  }));

  const optionLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: -theme.spacing["16p"],
    marginHorizontal: theme.spacing["4p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("CardActions.SetTemporaryAddressScreen.navTitle")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
          testID="CardActions.SetTemporaryAddressScreen:NavHeader"
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ContentContainer isScrollView>
            <Stack direction="vertical" align="stretch" gap="20p">
              <TextInput
                value={getValues("AddressLineOne")}
                onChangeText={value => setValue("AddressLineOne", value)}
                onClear={() => setValue("AddressLineOne", "")}
                control={control}
                label={t("CardActions.SetTemporaryAddressScreen.form.addressLineOne.label")}
                name="AddressLineOne"
                maxLength={100}
                testID="CardActions.SetTemporaryAddressScreen:AddressLineOneInput"
              />
              <TextInput
                value={getValues("AddressLineTwo")}
                onChangeText={value => setValue("AddressLineTwo", value)}
                onClear={() => setValue("AddressLineTwo", "")}
                control={control}
                label={t("CardActions.SetTemporaryAddressScreen.form.addressLineTwo.label")}
                name="AddressLineTwo"
                placeholder={t("CardActions.SetTemporaryAddressScreen.form.optional")}
                maxLength={100}
                testID="CardActions.SetTemporaryAddressScreen:AddressLineTwoInput"
              />
              <Typography.Text color="neutralBase" style={optionLabelStyle} weight="regular" size="caption1">
                {t("CardActions.SetTemporaryAddressScreen.form.optional")}
              </Typography.Text>
              <TextInput
                value={getValues("District")}
                onChangeText={value => setValue("District", value)}
                onClear={() => setValue("District", "")}
                control={control}
                label={t("CardActions.SetTemporaryAddressScreen.form.district.label")}
                name="District"
                testID="CardActions.SetTemporaryAddressScreen:DistrictInput"
              />
              <DropdownInput
                control={control}
                label={t("CardActions.SetTemporaryAddressScreen.form.city.label")}
                name="City"
                headerText={t("CardActions.SetTemporaryAddressScreen.form.city.dropdownHeader")}
                placeholder={t("CardActions.SetTemporaryAddressScreen.form.city.placeholder")}
                options={CITIES.map(city => ({ value: city, label: city }))}
                buttonLabel={t("CardActions.SetTemporaryAddressScreen.form.city.buttonLabel")}
                testID="CardActions.SetTemporaryAddressScreen:CityInput"
              />
              <TextInput
                value={getValues("PostalCode")}
                onChangeText={value => setValue("PostalCode", value)}
                onClear={() => setValue("PostalCode", "")}
                control={control}
                label={t("CardActions.SetTemporaryAddressScreen.form.postalCode.label")}
                name="PostalCode"
                keyboardType="number-pad"
                showCharacterCount
                maxLength={5}
                testID="CardActions.SetTemporaryAddressScreen:PostalCodeInput"
              />
            </Stack>
          </ContentContainer>
          <View style={buttonContainerStyle}>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="CardActions.SetTemporaryAddressScreen:SubmitButton">
              {t("CardActions.SetTemporaryAddressScreen.form.button")}
            </SubmitButton>
          </View>
        </KeyboardAvoidingView>
      </Page>
    </SafeAreaProvider>
  );
}

const CITIES = [
  "Abhā",
  "Abqaiq",
  "Al-Baḥah",
  "Al-Dammām",
  "Al-Hufūf",
  "Al-Jawf",
  "Al-Kharj (oasis)",
  "Al-Khubar",
  "Al-Qaṭīf",
  "Al-Ṭaʾif",
  "ʿArʿar",
  "Buraydah",
  "Dhahran",
  "Ḥāʾil",
  "Jiddah",
  "Jīzān",
  "Khamīs Mushayt",
  "King Khalīd Military City",
  "Mecca",
  "Medina",
  "Najrān",
  "Ras Tanura",
  "Riyadh",
  "Sakākā",
  "Tabūk",
  "Yanbuʿ",
];
