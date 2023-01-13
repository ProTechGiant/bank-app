import { Field, Formik } from "formik";
import { ScrollView, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import TextInput from "@/components/Form/TextInput";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Address, useOrderCardContext } from "../../context/OrderCardContext";
import { SetTemporaryAddressValidationSchema } from "./SetTemporaryAddressValidation";

export default function SetTemporaryAddressScreen() {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing.medium,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.medium,
    }),
    []
  );
  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      justifyContent: "flex-end",
      marginTop: theme.spacing.large,
    }),
    []
  );

  const navigation = useNavigation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const initialValues = {
    addressLineOne: orderCardValues.formValues.alternateAddress?.addressLineOne,
    addressLineTwo: orderCardValues.formValues.alternateAddress?.addressLineTwo,
    district: orderCardValues.formValues.alternateAddress?.district,
    city: orderCardValues.formValues.alternateAddress?.city,
    postalCode: orderCardValues.formValues.alternateAddress?.postalCode,
  };

  return (
    <Page keyboardAvoiding={true} keyboardVerticalOffset={55}>
      <NavHeader
        title="Set Temporary Address"
        backButton={false}
        closeButtonHandler={() => {
          navigation.navigate("ApplyCards.CardDeliveryDetails");
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ContentContainer style={containerStyle}>
          <View style={headerStyle}>
            <Typography.Text size="title1" weight="bold">
              Enter Temporary Address
            </Typography.Text>
          </View>
          <View style={{ flex: 1 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={SetTemporaryAddressValidationSchema}
              onSubmit={(values: Address) => {
                setOrderCardValues !== null &&
                  setOrderCardValues({
                    ...orderCardValues,
                    formValues: {
                      ...orderCardValues.formValues,
                      alternateAddress: values,
                    },
                  });
                navigation.navigate("ApplyCards.CardDeliveryDetails");
              }}>
              {() => {
                return (
                  <View style={{ flex: 1 }}>
                    <Stack space="medium">
                      <Field
                        component={TextInput}
                        label="Address line 1"
                        name="addressLineOne"
                        placeholder="Address line 1"
                        maxLength={100}
                      />
                      <Field
                        component={TextInput}
                        label="Address line 2"
                        name="addressLineTwo"
                        placeholder="Address line 2"
                        maxLength={100}
                        extra="Optional"
                      />
                      <Field component={TextInput} label="District" name="district" placeholder="District" />
                      <Field
                        component={DropdownInput}
                        label="City"
                        headerText="Select your city"
                        name="city"
                        placeholder="Select your city"
                        options={CITIES.map(city => ({ value: city, label: city }))}
                      />
                      <Field
                        component={TextInput}
                        label="Postal Code"
                        name="postalCode"
                        placeholder="Postal Code"
                        keyboardType="number-pad"
                        showCharacterCounter
                        maxLength={5}
                      />
                    </Stack>
                    <View style={buttonContainerStyle}>
                      <FormSubmitButton title="Confirm" />
                    </View>
                  </View>
                );
              }}
            </Formik>
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
