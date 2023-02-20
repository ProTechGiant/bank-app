import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { alphaNumericSpecialCharsRegExp } from "@/utils";

import { Address, useOrderCardContext } from "../../context/OrderCardContext";

export default function SetTemporaryAddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        addressLineOne: Yup.string()
          .required(t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.validation.required"))
          .matches(
            alphaNumericSpecialCharsRegExp,
            t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.validation.invalid")
          )
          .min(5, t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.validation.minLength")),
        district: Yup.string().required(t("ApplyCards.SetTemporaryAddressScreen.form.district.validation.required")),
        city: Yup.string().required(t("ApplyCards.SetTemporaryAddressScreen.form.city.validation.required")),
        postalCode: Yup.string()
          .required(t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.validation.required"))
          .min(5, t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.validation.minLength")),
      }),
    []
  );

  const { control, handleSubmit } = useForm<Address>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      addressLineOne: orderCardValues.formValues.alternateAddress?.addressLineOne,
      addressLineTwo: orderCardValues.formValues.alternateAddress?.addressLineTwo,
      district: orderCardValues.formValues.alternateAddress?.district,
      city: orderCardValues.formValues.alternateAddress?.city,
      postalCode: orderCardValues.formValues.alternateAddress?.postalCode,
    },
  });

  const handleOnSubmit = (values: Address) => {
    setOrderCardValues({
      ...orderCardValues,
      formValues: {
        ...orderCardValues.formValues,
        alternateAddress: values,
      },
    });
    navigation.navigate("ApplyCards.SetPinAndAddress");
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopColor: theme.palette["neutralBase-20"],
    paddingTop: theme.spacing["20p"],
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <Page>
      <NavHeader
        title={t("ApplyCards.SetTemporaryAddressScreen.navTitle")}
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={() => navigation.navigate("ApplyCards.SetPinAndAddress")} />}
      />
      <ContentContainer isScrollView style={{ flex: 1 }}>
        <Stack direction="vertical" align="stretch" gap="20p">
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.label")}
            name="addressLineOne"
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.placeholder")}
            maxLength={100}
          />
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.addressLineTwo.label")}
            name="addressLineTwo"
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.addressLineTwo.placeholder")}
            maxLength={100}
            extra="Optional"
          />
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.district.label")}
            name="district"
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.district.placeholder")}
          />
          <DropdownInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.city.label")}
            name="city"
            headerText={t("ApplyCards.SetTemporaryAddressScreen.form.city.dropdownHeader")}
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.city.placeholder")}
            options={CITIES.map(city => ({ value: city, label: city }))}
            buttonLabel={t("ApplyCards.SetTemporaryAddressScreen.form.city.buttonLabel")}
          />
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.label")}
            name="postalCode"
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.placeholder")}
            keyboardType="number-pad"
            showCharacterCount
            maxLength={5}
          />
        </Stack>
      </ContentContainer>
      <View style={buttonContainerStyle}>
        <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
          {t("ApplyCards.SetTemporaryAddressScreen.form.button")}
        </SubmitButton>
      </View>
    </Page>
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
