import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Radio from "@/components/Radio";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { AddLocationIcon, LocationPinIcon } from "../assets/icons";
import { mockDefaultAddress as defaultAddress } from "../mocks";

export default function DeliveryAddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false);

  const handleSelectAddress = () => {
    setIsAddressSelected(!isAddressSelected);
  };

  const handleConfirmAddress = () => {
    navigation.navigate("AllInOneCard.SummaryAddressScreen", { address: defaultAddress });
  };

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
              <Pressable
                onPress={handleSelectAddress}
                style={addressContainerStyle}
                testID="AllInOneCard.DeliveryAddressScreen:Pressable">
                <ContentContainer>
                  <Stack direction="horizontal" justify="space-between" align="center">
                    <Stack direction="horizontal" gap="16p" align="flex-start">
                      <LocationPinIcon />
                      <View>
                        <Typography.Text size="callout" weight="regular" color="neutralBase+30">
                          {defaultAddress.BuildingNumber}
                        </Typography.Text>
                        <Typography.Text
                          size="footnote"
                          weight="regular"
                          color="neutralBase-10"
                          style={textContainerStyle}>
                          {defaultAddress.District}
                        </Typography.Text>
                        <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
                          {defaultAddress.City} {defaultAddress.PostalCode}
                        </Typography.Text>
                      </View>
                    </Stack>
                    <Radio
                      isSelected={isAddressSelected}
                      onPress={handleSelectAddress}
                      testID="AllInOneCard.DeliveryAddressScreen:Radio"
                    />
                  </Stack>
                </ContentContainer>
              </Pressable>
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
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
