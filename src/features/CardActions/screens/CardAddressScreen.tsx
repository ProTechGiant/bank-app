import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { SearchIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { PinAddressIcon } from "@/features/AllInOneCard/assets/icons";
import { SearchLocation } from "@/features/AllInOneCard/components";
import Map from "@/features/AllInOneCard/components/Map";
import { mockLocations } from "@/features/AllInOneCard/mocks";
import { Address, LocationState } from "@/features/AllInOneCard/types";
import { extractAddressDetails } from "@/features/AllInOneCard/utils/extractAddressDetails";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

export default function CardAddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState<LocationState>({
    shouldUpdateMarker: false,
    location: mockLocations[0],
  });
  const selectedAddress: Address | undefined =
    selectedLocation !== undefined ? extractAddressDetails(selectedLocation.location.name) : undefined;

  const handleConfirmAddress = () => {
    navigation.navigate("CardActions.SetTemporaryAddressScreen", {
      initialValue: addresses.find(value => value.id === TEMPORARY_ID),
      navigateTo: navigateTo !== undefined ? navigateTo : "CardActions.ApplyCardScreen",
    });
  };

  const handleSetAddressManually = () => {
    //TO DO when settings navigation is done
  };

  const subTitleStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["12p"],
  }));

  const addressContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const mapContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
    height: 265,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    overflow: "hidden",
  }));

  const handleMarkerSelection = () => {
    setSelectedLocation({
      shouldUpdateMarker: false,
      location: mockLocations[Math.floor(Math.random() * (mockLocations.length - 1 + 1) + 0)],
    });
  };

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOne.PINAddressScreen:Page">
      <NavHeader testID="AllInOneCard.PINAddressScreen:NavHeader" />
      <ContentContainer>
        <View style={styles.container}>
          <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
            <View>
              <Typography.Text size="title1" weight="medium" color="neutralBase+30">
                {t("AllInOneCard.PINAddressScreen.title")}
              </Typography.Text>
              <Typography.Text size="callout" color="neutralBase" style={subTitleStyle}>
                {t("AllInOneCard.PINAddressScreen.subTitle")}
              </Typography.Text>
              <SearchLocation
                selectedLocation={selectedLocation}
                onLocationSelect={item => setSelectedLocation({ shouldUpdateMarker: true, location: item })}
                startIcon={<SearchIcon />}
                locations={mockLocations}
              />
              <View style={mapContainerStyle}>
                <Map locationState={selectedLocation} onMarkerSelection={handleMarkerSelection} />
              </View>
              {selectedLocation ? (
                <>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30" style={addressContainerStyle}>
                    {t("AllInOneCard.PINAddressScreen.selectedLocation")}
                  </Typography.Text>
                  <Stack direction="horizontal" gap="16p" align="flex-start">
                    <PinAddressIcon />
                    <View>
                      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                        {/* {selectedAddress.BuildingNumber} */}
                        {selectedAddress?.BuildingNumber}
                      </Typography.Text>
                      <Typography.Text size="footnote" color="neutralBase-10">
                        {selectedAddress?.District}
                      </Typography.Text>
                    </View>
                  </Stack>
                </>
              ) : (
                <></>
              )}
            </View>
            <Stack direction="vertical" gap="8p" align="stretch" justify="space-around">
              <Button
                testID="AllInOneCard.PINAddressScreen.ConfirmButton"
                onPress={() => {
                  handleConfirmAddress();
                }}
                //TO DO when the rest of screens are done
              >
                {t("AllInOneCard.PINAddressScreen.confirmButton")}
              </Button>
              <Button
                testID="AllInOneCard.PINAddressScreen.enterAddressButton"
                variant="secondary"
                onPress={handleSetAddressManually}>
                {t("AllInOneCard.PINAddressScreen.enterAddressButton")}
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
