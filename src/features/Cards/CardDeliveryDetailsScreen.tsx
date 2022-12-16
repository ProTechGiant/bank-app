import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import AddressSelector from "@/components/AddressSelector";
import ApplyCardHeader from "@/components/ApplyForCardHeader";
import Button from "@/components/Button";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";
import { mockPrimaryDeliveryAddress, mockAlternativeDeliveryAddress } from "@/mocks/deliveryAddressData";

export default function CardDeliveryDetailsScreen() {
  const navigation = useNavigation();

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

  const handleConfirm = () => {
    navigation.navigate("Cards.CardOrdered");
  };

  const handleSetAnotherAddress = () => {
    navigation.navigate("Cards.SetAnotherAddress");
  };

  const handleAddressSelect = (id: string) => {
    setAddressData(
      addressData.map(data => {
        return { ...data, is_selected: data.id === id };
      })
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApplyCardHeader title="Order card" backButton={true} />
      <View style={styles.container}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={4} totalStep={4} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
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
        <Button onPress={handleConfirm}>
          <Typography.Text color="neutralBase-50" size="body" weight="medium">
            Confirm and continue
          </Typography.Text>
        </Button>
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
  container: {
    flex: 1,
    padding: spacing.medium,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.medium,
  },
  progressIndicator: {
    marginTop: 12,
    marginBottom: 44,
  },
  paragraph: {
    marginBottom: 24,
  },
});
