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
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";
import { Address } from "@/types/Address";
import { alphaNumericSpecialCharsRegExp } from "@/utils";

interface TemporaryAddressProps {
  address?: Address;
  onSubmit: (address: Address) => void;
}

export default function TemporaryAddress({ address, onSubmit }: TemporaryAddressProps) {
  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        AddressLineOne: Yup.string()
          .required(t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.validation.required"))
          .matches(
            alphaNumericSpecialCharsRegExp,
            t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.validation.invalid")
          )
          .min(5, t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.validation.minLength")),
        District: Yup.string().required(t("ApplyCards.SetTemporaryAddressScreen.form.district.validation.required")),
        City: Yup.string().required(t("ApplyCards.SetTemporaryAddressScreen.form.city.validation.required")),
        PostalCode: Yup.string()
          .required(t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.validation.required"))
          .min(5, t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.validation.minLength")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<Address>({
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

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopColor: theme.palette["neutralBase-20"],
    paddingTop: theme.spacing["20p"],
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <>
      <ContentContainer isScrollView style={{ flex: 1 }}>
        <Stack direction="vertical" align="stretch" gap="20p">
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.addressLineOne.label")}
            name="AddressLineOne"
            maxLength={100}
          />
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.addressLineTwo.label")}
            name="AddressLineTwo"
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.optional")}
            maxLength={100}
          />
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.district.label")}
            name="District"
          />
          <DropdownInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.city.label")}
            name="City"
            headerText={t("ApplyCards.SetTemporaryAddressScreen.form.city.dropdownHeader")}
            placeholder={t("ApplyCards.SetTemporaryAddressScreen.form.city.placeholder")}
            options={CITIES.map(city => ({ value: city, label: city }))}
            buttonLabel={t("ApplyCards.SetTemporaryAddressScreen.form.city.buttonLabel")}
          />
          <TextInput
            control={control}
            label={t("ApplyCards.SetTemporaryAddressScreen.form.postalCode.label")}
            name="PostalCode"
            keyboardType="number-pad"
            showCharacterCount
            maxLength={5}
          />
        </Stack>
      </ContentContainer>
      <View style={buttonContainerStyle}>
        <SubmitButton control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("ApplyCards.SetTemporaryAddressScreen.form.button")}
        </SubmitButton>
      </View>
    </>
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
