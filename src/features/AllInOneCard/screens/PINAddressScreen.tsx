import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/Input/SearchInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { PinAddressIcon } from "../assets/icons";
import { selectedAddress } from "../mocks";

export default function PINAddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [location, setLocation] = useState<string>("");
  const handleOnSearch = (text: string) => {
    setLocation(text);
  };

  const handleConfirmAddress = () => {
    navigation.navigate("AllInOneCard.SummaryAddressScreen", { address: selectedAddress });
  };

  const handleSetAddressManually = () => {
    navigation.navigate("AllInOneCard.SetAddressScreen", { address: undefined });
  };

  const subTitleStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["12p"],
  }));

  const addressContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const mapContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
    //Delete when add map
    height: 300,
    width: 300,
    borderWidth: 2,
  }));

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
              <SearchInput
                onSearch={handleOnSearch}
                placeholder={t("AllInOneCard.PINAddressScreen.SearchInputPlaceholder")}
                testID="AllInOneCard.PINAddressScreen:SelectLocationSearchInput"
                value={location}
                onClear={() => {
                  setLocation("");
                }}
              />
              <View style={mapContainerStyle} />
              <Typography.Text size="callout" weight="medium" color="neutralBase+30" style={addressContainerStyle}>
                {t("AllInOneCard.PINAddressScreen.selectedLocation")}
              </Typography.Text>
              <Stack direction="horizontal" gap="16p" align="flex-start">
                <PinAddressIcon />
                <View>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    {selectedAddress.BuildingNumber}
                  </Typography.Text>
                  <Typography.Text size="footnote" color="neutralBase-10">
                    {selectedAddress.District}
                  </Typography.Text>
                </View>
              </Stack>
            </View>
            <Stack direction="vertical" gap="8p" align="stretch" justify="space-around">
              <Button testID="AllInOneCard.PINAddressScreen.ConfirmButton" onPress={handleConfirmAddress}>
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
