import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import AddressSelector from "@/components/AddressSelector";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import usePrimaryAddress from "@/hooks/use-primary-address";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address } from "@/types/Address";

import { useApplyCardsContext } from "../../context/ApplyCardsContext";

interface AddressDataType extends Address {
  id: string;
  isSelected: boolean;
}

interface CardDeliveryDetailsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  navigateTo?:
    | "CardActions.ConfirmCardDeliveryAddress"
    | "CardActions.ApplyCardScreen"
    | "CardActions.ReportCardScreen";
}

export default function CardDeliveryDetails({
  onCancel,
  onSubmit,
  isSubmitting,
  navigateTo,
}: CardDeliveryDetailsProps) {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.ApplyCardScreen">>();
  const { t } = useTranslation();

  const applyCardsContext = useApplyCardsContext();
  const primaryAddress = usePrimaryAddress();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<AddressDataType[]>([]);

  useEffect(() => {
    if (!primaryAddress.isError) return;
    setIsErrorModalVisible(primaryAddress.isError);
  }, [primaryAddress.isError]);

  // Set primary address once available
  useEffect(() => {
    if (primaryAddress.data === undefined) return;
    setAddresses([{ ...primaryAddress.data, id: PRIMARY_ID, isSelected: true }]);
  }, [primaryAddress.data]);

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

    if (isTemporaryAddressSelected) {
      const selectedAddress = addresses.find(element => element.isSelected);
      if (selectedAddress === undefined) return;

      const { id, isSelected, ...address } = selectedAddress;
      applyCardsContext.setValue("AlternateAddress", address);
    }

    onSubmit();
  };

  const handleOnSetTemporaryAddress = () => {
    navigation.navigate("CardActions.SetTemporaryAddressScreen", {
      initialValue: addresses.find(value => value.id === TEMPORARY_ID),
      navigateTo: navigateTo !== undefined ? navigateTo : "CardActions.ApplyCardScreen",
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

  const handleOnCloseError = () => {
    setIsErrorModalVisible(false);
    onCancel();
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["16p"],
  }));

  const hasTemporaryAddress = addresses.length > 1;
  const isTemporaryAddressSelected = addresses.find(v => v.isSelected)?.id === TEMPORARY_ID;

  return (
    <>
      <View style={styles.flex}>
        <View style={styles.flex}>
          <View style={headerStyle}>
            <Typography.Text size="large" weight="bold">
              {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.CardDeliveryDetails.title")}
            </Typography.Text>
          </View>
          <View style={styles.paragraph}>
            <Typography.Text>
              {hasTemporaryAddress
                ? t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.CardDeliveryDetails.paragraph.checkHighlighted")
                : t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.CardDeliveryDetails.paragraph.default")}
            </Typography.Text>
          </View>
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
        <Button onPress={handleOnConfirm} loading={isSubmitting} variant="primary">
          {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.CardDeliveryDetails.buttons.confirm")}
        </Button>
        <Button
          onPress={handleOnSetTemporaryAddress}
          variant="tertiary"
          disabled={hasTemporaryAddress && !isTemporaryAddressSelected}>
          {hasTemporaryAddress
            ? t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.CardDeliveryDetails.buttons.edit")
            : t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.CardDeliveryDetails.buttons.setAddress")}
        </Button>
      </View>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={handleOnCloseError}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  paragraph: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
});

const PRIMARY_ID = "primary";
const TEMPORARY_ID = "temporary";
