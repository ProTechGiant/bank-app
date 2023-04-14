import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import AddressSelector from "@/components/AddressSelector";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address } from "@/types/Address";

import { CardActionsStackParams } from "../../CardActionsStack";

interface ConfirmDeliveryAddressProps {
  onConfirm: (alternativeAddress: Address | undefined) => void;
  primaryAddress?: Address;
}

interface AddressDataType extends Address {
  id: string;
  isSelected: boolean;
}

export default function ConfirmDeliveryAddress({ onConfirm, primaryAddress }: ConfirmDeliveryAddressProps) {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.ReportCardScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<AddressDataType[]>([]);

  // Set primary address once available
  useEffect(() => {
    if (primaryAddress === undefined) return;
    setAddresses([{ ...primaryAddress, id: PRIMARY_ID, isSelected: true }]);
  }, [primaryAddress]);

  // Add alternative address if selected by user
  useEffect(() => {
    if (route.params?.alternativeAddress === undefined) return;
    const alternativeAddress = route.params.alternativeAddress;

    if (!hasTemporaryAddress) {
      setAddresses(current => [
        ...current.map(element => ({ ...element, isSelected: false })),
        { ...alternativeAddress, id: TEMPORARY_ID, isSelected: true },
      ]);
    }

    if (hasTemporaryAddress) {
      setAddresses(current =>
        current.map(element => {
          if (element.id === PRIMARY_ID) return element;
          return { ...alternativeAddress, id: TEMPORARY_ID, isSelected: true };
        })
      );
    }
  }, [route.params]);

  const handleOnConfirm = () => {
    if (addresses.length < 1) return;

    if (!isTemporaryAddressSelected) return onConfirm(undefined);
    return onConfirm(addresses.find(element => element.isSelected) as Address);
  };

  const handleSetTemporaryAddress = () => {
    navigation.navigate("CardActions.SetTemporaryAddressScreen", {
      initialValue: addresses.find(value => value.id === TEMPORARY_ID),
      navigateTo: "CardActions.ReportCardScreen",
    });
  };

  const handleOnAddressPress = (addressId: string) => {
    setAddresses(current =>
      current.map(value => ({
        ...value,
        isSelected: value.id === addressId,
      }))
    );
  };

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignSelf: "flex-start",
      marginBottom: theme.spacing["16p"],
    }),
    []
  );

  const paragraph = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["24p"],
  }));

  const hasTemporaryAddress = addresses.length > 1;
  const isTemporaryAddressSelected = addresses.find(v => v.isSelected)?.id === TEMPORARY_ID;

  return (
    <>
      <ContentContainer>
        <View style={styles.contentContainer}>
          <View style={headerStyle}>
            <Typography.Text size="title1" weight="semiBold">
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.navTitle")}
            </Typography.Text>
          </View>
          <Typography.Text color="neutralBase+30" style={paragraph} weight="regular" size="callout">
            {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.description")}
          </Typography.Text>
          <Stack direction="vertical" gap="20p" align="stretch">
            {addresses.map((address, index) => {
              return (
                <AddressSelector
                  key={index}
                  addressLineOne={address.AddressLineOne}
                  addressLineTwo={address.AddressLineTwo}
                  addressLineThree={address.District}
                  addressLineFour={
                    address.City === undefined ? `${address.PostalCode}` : `${address.City} ${address.PostalCode}`
                  }
                  isSelected={address.isSelected}
                  isTemporary={address.id === TEMPORARY_ID}
                  onPress={() => handleOnAddressPress(address.id)}
                />
              );
            })}
          </Stack>
        </View>
        <Button disabled={addresses.length < 1} onPress={handleOnConfirm} variant="primary">
          {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.buttonTitle")}
        </Button>
        <Button
          onPress={handleSetTemporaryAddress}
          variant="tertiary"
          disabled={hasTemporaryAddress && !isTemporaryAddressSelected}>
          {hasTemporaryAddress
            ? t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.editAddressButton")
            : t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.differentAddressButton")}
        </Button>
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

const PRIMARY_ID = "primary";
const TEMPORARY_ID = "temporary";
