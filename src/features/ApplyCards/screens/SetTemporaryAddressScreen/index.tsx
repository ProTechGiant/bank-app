import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Address, useOrderCardContext } from "../../context/OrderCardContext";
import { SetTemporaryAddressValidationSchema } from "./SetTemporaryAddressValidation";

export default function SetTemporaryAddressScreen() {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing.regular,
      paddingBottom: theme.spacing.regular,
    }),
    []
  );
  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: "auto",
      borderTopColor: theme.palette["neutralBase-20"],
      paddingHorizontal: theme.spacing.regular,
      paddingTop: theme.spacing.regular,
      borderTopWidth: 0.5,
      marginHorizontal: -theme.spacing.regular,
    }),
    []
  );

  const { t } = useTranslation();
  const navigation = useNavigation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();

  const { control, handleSubmit } = useForm({
    mode: "onBlur",
    resolver: yupResolver(SetTemporaryAddressValidationSchema),
    defaultValues: {
      addressLineOne: orderCardValues.formValues.alternateAddress?.addressLineOne,
      addressLineTwo: orderCardValues.formValues.alternateAddress?.addressLineTwo,
      district: orderCardValues.formValues.alternateAddress?.district,
      city: orderCardValues.formValues.alternateAddress?.city,
      postalCode: orderCardValues.formValues.alternateAddress?.postalCode,
    } as Address,
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

  return (
    <Page keyboardAvoiding={true} keyboardVerticalOffset={55}>
      <NavHeader
        title={t("ApplyCards.SetTemporaryAddressScreen.navTitle")}
        backButton={false}
        closeButtonHandler={() => {
          navigation.navigate("ApplyCards.SetPinAndAddress");
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer style={containerStyle}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Stack direction="vertical" gap="regular">
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
              <View style={[buttonContainerStyle]}>
                <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                  {t("ApplyCards.SetTemporaryAddressScreen.form.button")}
                </SubmitButton>
              </View>
            </View>
          </View>
        </ContentContainer>
      </ScrollView>
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
