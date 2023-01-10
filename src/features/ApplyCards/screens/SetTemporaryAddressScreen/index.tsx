import { Field, Formik } from "formik";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import DropdownInput from "@/components/Form/DropdownInput";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { Stack } from "@/components/Stack";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Address, useOrderCardContext } from "../../context/OrderCardContext";
import { SetTemporaryAddressValidationSchema } from "./SetTemporaryAddressValidation";

export default function SetTemporaryAddressScreen() {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      padding: theme.spacing.medium,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingVertical: theme.spacing.medium,
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <NavHeader
          title="Set Temporary Address"
          backButton={false}
          closeButtonHandler={() => {
            navigation.navigate("ApplyCards.CardDeliveryDetails");
          }}
        />
        <View style={container}>
          <View style={headerStyle}>
            <Typography.Text size="large" weight="bold">
              Enter your delivery address
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
                      <TextField
                        label="Address line 1"
                        name="addressLineOne"
                        placeholder="Address line 1"
                        maxLength={100}
                      />
                      <TextField
                        label="Address line 2"
                        name="addressLineTwo"
                        placeholder="Address line 2"
                        maxLength={100}
                        helperText="Optional"
                      />
                      <TextField label="District" name="district" placeholder="District" />
                      <Field
                        component={DropdownInput}
                        label="City"
                        name="city"
                        placeholder="Select your city"
                        options={CITIES.map(city => ({ value: city, label: city }))}
                      />
                      <TextField
                        label="Postal Code"
                        name="postalCode"
                        placeholder="Postal Code"
                        keyboardType="number-pad"
                        hasCharacterCount
                        maxLength={5}
                      />
                    </Stack>
                    <View style={buttonContainerStyle}>
                      <FormSubmitButton title="Confirm and continue" />
                    </View>
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  submitButtonView: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 80,
  },
});

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
