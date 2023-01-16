import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Address, useOrderCardContext } from "../../context/OrderCardContext";
import { SetTemporaryAddressValidationSchema } from "./SetTemporaryAddressValidation";

export default function SetTemporaryAddressScreen() {
  const navigation = useNavigation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing.medium,
      paddingBottom: theme.spacing.regular,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.medium,
    }),
    []
  );
  const formContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.xlarge,
    }),
    []
  );

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

    navigation.navigate("ApplyCards.CardDeliveryDetails");
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
            <View style={{ flex: 1 }}>
              <View style={formContainerStyle}>
                <Stack space="medium">
                  <TextInput
                    control={control}
                    label="Address line 1"
                    name="addressLineOne"
                    placeholder="Address line 1"
                    maxLength={100}
                  />
                  <TextInput
                    control={control}
                    label="Address line 2"
                    name="addressLineTwo"
                    placeholder="Address line 2"
                    maxLength={100}
                    extra="Optional"
                  />
                  <TextInput control={control} label="District" name="district" placeholder="District" />
                  <DropdownInput
                    control={control}
                    label="City"
                    name="city"
                    headerText="Select a city"
                    placeholder="Select your city"
                    options={CITIES.map(city => ({ value: city, label: city }))}
                  />
                  <TextInput
                    control={control}
                    label="Postal Code"
                    name="postalCode"
                    placeholder="Postal Code"
                    keyboardType="number-pad"
                    showCharacterCount
                    maxLength={5}
                  />
                </Stack>
              </View>
              <View style={styles.buttonContainer}>
                <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                  Confirm
                </SubmitButton>
              </View>
            </View>
          </View>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
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
