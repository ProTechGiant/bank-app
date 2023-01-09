import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useMutation } from "react-query";

import { orderCardEndPoint } from "@/Axios/AxiosAgent";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import { OrderCardFormValues, useOrderCardContext } from "@/features/ApplyCards/context/OrderCardContext";
import { mockPrimaryDeliveryAddress } from "@/mocks/deliveryAddressData";
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
  const PRIMARY_ID = "primary";
  const TEMPORARY_ID = "temporary";

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
  const hasTemporaryAddress = orderCardValues.formValues.alternateAddress !== undefined;
  const buttonText = hasTemporaryAddress ? "Edit Temporary Address" : "Set Temporary Address";
  const primaryAddress = mockPrimaryDeliveryAddress.addresses.map(data => {
    return { ...data, id: PRIMARY_ID, is_selected: !hasTemporaryAddress, is_temp_address: false };
  });

  const [addressData, setAddressData] = useState(primaryAddress);
  const [isTempAddressButtonActive, setIsTempAddressButtonActive] = useState(true);

  useEffect(() => {
    const temporaryAddress = hasTemporaryAddress
      ? [
          {
            ...orderCardValues.formValues.alternateAddress,
            id: TEMPORARY_ID,
            is_temp_address: true,
            is_selected: true,
          },
        ]
      : [];
    const initAddressData = hasTemporaryAddress ? [...temporaryAddress, ...primaryAddress] : primaryAddress;
    setAddressData(initAddressData);
  }, [orderCardValues]);

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
    const selectedAddressType = !isEmpty(addressData) && addressData.filter(data => data.is_selected === true)[0].id;
    const payload = { ...orderCardValues.formValues };

    if (selectedAddressType === PRIMARY_ID) {
      delete payload.alternateAddress;
    }

    mutate(payload);
  };

  const handleSetTemporaryAddress = () => {
    navigation.navigate("ApplyCards.SetTemporaryAddress");
  };

  const handleAddressSelect = (id: string) => {
    setIsTempAddressButtonActive(!hasTemporaryAddress || id === TEMPORARY_ID);
    setAddressData(
      addressData.map(data => {
        return { ...data, is_selected: data.id === id };
      })
    );
  };

  const handleOnBack = () => {
    navigation.navigate("ApplyCards.CreateCardPin");
  };

  return (
    <Page>
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
            {!isEmpty(addressData) &&
              addressData.map((address, index) => {
                const addressLineThree = `${address.district} ${address.city} ${address.postalCode}`;

                return (
                  <AddressSelector
                    key={index}
                    id={address.id}
                    addressLineOne={address.addressLineOne}
                    addressLineTwo={address.addressLineTwo}
                    addressLineThree={addressLineThree}
                    isSelected={address.is_selected}
                    isTemporary={address.is_temp_address}
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
        <Button onPress={handleSetTemporaryAddress} variant="tertiary" disabled={!isTempAddressButtonActive}>
          <Typography.Text color="tintBase+20" size="body">
            {buttonText}
          </Typography.Text>
        </Button>
      </View>
    </Page>
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
