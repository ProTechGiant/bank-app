import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Radio from "@/components/Radio";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";
import { Address } from "@/types/CustomerProfile";

import { AddLocationIcon, LocationPinIcon } from "../assets/icons";
import { mockDefaultAddress } from "../mocks";

export default function DeliveryAddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: addressCustomer, isLoading } = useCustomerProfile();
  const [isAddressSelected, setIsAddressSelected] = useState<number>();
  const [addresses, setAddresses] = useState<Address[]>();

  useEffect(() => {
    if (!isLoading) {
      if (
        addressCustomer?.CustomerAddress?.Address !== undefined &&
        addressCustomer?.CustomerAddress?.Address.length > 0
      ) {
        setAddresses(addressCustomer?.CustomerAddress?.Address);
      } else {
        // TODO: mostly users does not have address in their info so for time using mock address if not available
        setAddresses([mockDefaultAddress]);
      }
    }
  }, [addressCustomer, isLoading]);

  const handleSelectAddress = (addressType: number) => {
    setIsAddressSelected(addressType);
  };

  const handleConfirmAddress = () => {
    const selectedAddress = addresses?.find(address => address.AddressType === isAddressSelected);
    if (!selectedAddress) {
      return;
    }
    navigation.navigate("AllInOneCard.SummaryAddressScreen", { address: selectedAddress });
  };

  //TODO : implement function later
  const handleSetNewAddress = () => {
    navigation.navigate("AllInOneCard.PINAddressScreen");
  };

  const subTitleStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const textContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const addressContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.DeliveryAddressScreen:Page">
      <NavHeader testID="AllInOneCard.DeliveryAddressScreen:NavHeader" />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <ContentContainer>
          <View style={styles.container}>
            <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
              <View>
                <Typography.Text size="title1" weight="medium" color="neutralBase+30">
                  {t("AllInOneCard.DeliveryAddressScreen.title")}
                </Typography.Text>
                <Typography.Text size="callout" weight="regular" color="neutralBase+30" style={subTitleStyle}>
                  {t("AllInOneCard.DeliveryAddressScreen.subTitle")}
                </Typography.Text>
                {addresses !== undefined
                  ? addresses.map((address, index) => (
                      <Pressable
                        onPress={handleSelectAddress.bind(null, address.AddressType)}
                        style={addressContainerStyle}
                        key={index}
                        testID="AllInOneCard.DeliveryAddressScreen:Pressable">
                        <ContentContainer>
                          <Stack direction="horizontal" justify="space-between" align="center">
                            <Stack direction="horizontal" gap="16p" align="flex-start">
                              <LocationPinIcon />
                              <View>
                                <Typography.Text size="callout" weight="regular" color="neutralBase+30">
                                  {address.IsPrimary ? t("AllInOneCard.DeliveryAddressScreen.defaultAddress") : ""}
                                </Typography.Text>
                                <Typography.Text
                                  size="footnote"
                                  weight="regular"
                                  color="neutralBase-10"
                                  style={textContainerStyle}>
                                  {address.StreetName}
                                </Typography.Text>
                                <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
                                  {address.District} {address.Postcode}
                                </Typography.Text>
                              </View>
                            </Stack>
                            <Radio
                              isSelected={address.AddressType === isAddressSelected}
                              onPress={handleSelectAddress.bind(null, address.AddressType)}
                              testID="AllInOneCard.DeliveryAddressScreen:Radio"
                            />
                          </Stack>
                        </ContentContainer>
                      </Pressable>
                    ))
                  : null}
              </View>
              <Stack direction="vertical" gap="8p" align="stretch" justify="space-around">
                <Button
                  disabled={!isAddressSelected}
                  onPress={handleConfirmAddress}
                  testID="AllInOneCard.DeliveryAddressScreen:confirmButton">
                  {t("AllInOneCard.DeliveryAddressScreen.confirmButton")}
                </Button>
                <Button
                  variant="secondary"
                  iconLeft={<AddLocationIcon />}
                  onPress={handleSetNewAddress}
                  testID="AllInOneCard.DeliveryAddressScreen:setNewDeliveryAddressButton">
                  {t("AllInOneCard.DeliveryAddressScreen.setNewDeliveryAddressButton")}
                </Button>
              </Stack>
            </Stack>
          </View>
        </ContentContainer>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
