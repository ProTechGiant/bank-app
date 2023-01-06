import { useState } from "react";
import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { useMutation } from "react-query";

import { orderCardEndPoint } from "@/Axios/AxiosAgent";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOrderCardContext } from "@/features/ApplyCards/context/OrderCardContext";
import { mockAlternativeDeliveryAddress, mockPrimaryDeliveryAddress } from "@/mocks/deliveryAddressData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AddressSelector from "./AddressSelector";

export default function CardDeliveryDetailsScreen() {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      padding: theme.spacing.medium,
    }),
    []
  );

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing.medium,
    }),
    []
  );

  const API_SUCCESS_MESSAGE = "Successful request card creation";
  const GENERIC_ERROR = {
    name: "error",
    message: "Error occurred. Please try again later or contact Customer Care",
  };

  const navigation = useNavigation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const hasAlternativeAddress = mockAlternativeDeliveryAddress.addresses.length > 0;
  const primaryAddress = mockPrimaryDeliveryAddress.addresses.map(data => {
    return { ...data, id: "primary", is_selected: !hasAlternativeAddress };
  });

  const alternativeAddress = hasAlternativeAddress
    ? mockAlternativeDeliveryAddress.addresses.map((data, index) => {
        return {
          ...data,
          id: String(index + 1),
          is_selected: index === mockAlternativeDeliveryAddress.addresses.length - 1,
        };
      })
    : [];

  const initAddressData = alternativeAddress ? [...primaryAddress, ...alternativeAddress] : primaryAddress;

  const [addressData, setAddressData] = useState(initAddressData);

  const updateFormState = (error?: Error) => {
    setOrderCardValues !== null &&
      setOrderCardValues({
        ...orderCardValues,
        formState: {
          error: error,
        },
      });
  };

  const postOrderCard = async (formData: OrderCardFormValues) => {
    const res = await fetch(orderCardEndPoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  };

  const { mutate, isLoading } = useMutation(postOrderCard, {
    onSuccess: data => {
      if (data.response === API_SUCCESS_MESSAGE) {
        updateFormState(undefined);
      } else {
        updateFormState(GENERIC_ERROR);
      }
      navigation.navigate("ApplyCards.CardOrdered");
    },
    onError: () => {
      updateFormState(GENERIC_ERROR);
      navigation.navigate("ApplyCards.CardOrdered");
    },
  });

  const handleConfirm = () => {
    mutate(orderCardValues.formValues);
  };

  const handleSetAnotherAddress = () => {
    navigation.navigate("ApplyCards.SetAnotherAddress");
  };

  const handleAddressSelect = (id: string) => {
    setAddressData(
      addressData.map(data => {
        return { ...data, is_selected: data.id === id };
      })
    );
  };

  const handleOnBack = () => {
    setOrderCardValues !== null &&
      setOrderCardValues({
        ...orderCardValues,
        createCardPinMode: "input",
      });
    navigation.navigate("ApplyCards.CreateCardPin");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavHeader title="Order card" backButton={true} backButtonHandler={handleOnBack} />
      <View style={container}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={3} totalStep={3} />
        </View>
        <View style={styles.contentContainer}>
          <View style={headerStyle}>
            <Typography.Text size="large" weight="bold">
              Card delivery details
            </Typography.Text>
          </View>
          <View style={styles.paragraph}>
            <Typography.Text>Your card will be sent here:</Typography.Text>
          </View>
          <Stack space="medium">
            {addressData.map((address, index) => {
              const addressLine3 = `${address.district} ${address.city} ${address.postalCode}`;

              return (
                <AddressSelector
                  key={index}
                  id={address.id}
                  addressLine1={address.line1}
                  addressLine2={address.line2}
                  addressLine3={addressLine3}
                  isSelected={address.is_selected}
                  handlePress={handleAddressSelect}
                />
              );
            })}
          </Stack>
        </View>
        {!isLoading && (
          <Button onPress={handleConfirm}>
            <Typography.Text color="neutralBase-50" size="body" weight="medium">
              Confirm and continue
            </Typography.Text>
          </Button>
        )}
        {isLoading && <Button type="loader" />}
        <Button onPress={handleSetAnotherAddress} variant="tertiary">
          <Typography.Text color="tintBase+20" size="body">
            Set another address
          </Typography.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 24,
  },
  progressIndicator: {
    marginBottom: 44,
    marginTop: 12,
  },
});
