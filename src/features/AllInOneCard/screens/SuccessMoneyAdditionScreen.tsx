import { RouteProp, StackActions, useRoute } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { SuccessMoneyAddition } from "../assets/images";
import { FormattedPrice } from "../components";

export default function SuccessMoneyAdditionScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.SuccessMoneyAdditionScreen">>();
  const { destination, addedValue, isAddMoney } = route.params;

  const { t } = useTranslation();
  const navigation = useNavigation();
  const currentBalance = Number(destination.Balance) + addedValue;

  const handleDone = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const handleAddMoney = () => {
    navigation.dispatch(StackActions.pop(1));
    navigation.goBack();
  };

  const StatusBarColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const accountContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBaseHover,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase+20"],
    borderRadius: theme.radii.medium,
    padding: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase+30">
      <StatusBar backgroundColor={StatusBarColor} barStyle="light-content" />
      <ContentContainer>
        <View style={styles.container}>
          <Stack flex={1} direction="vertical">
            <Stack direction="vertical" align="stretch" gap="24p" justify="space-between">
              <Image resizeMode="contain" source={SuccessMoneyAddition} />
              <Stack direction="vertical" align="center" gap="8p" justify="space-between" style={containerStyle}>
                <Typography.Header size="brand" weight="bold" align="center" color="neutralBase-60">
                  {t("AllInOneCard.SuccessMoneyAdditionScreen.title")}
                </Typography.Header>
                <Typography.Text size="callout" weight="regular" align="center" color="neutralBase-60">
                  {isAddMoney
                    ? t("AllInOneCard.SuccessMoneyAdditionScreen.topUpDescription")
                    : t("AllInOneCard.SuccessMoneyAdditionScreen.refundDescription")}
                </Typography.Text>
                <Stack direction="vertical" align="stretch" gap="8p" style={styles.accountContainer}>
                  <Typography.Text size="callout" weight="regular" color="neutralBase-60" align="left">
                    {t("AllInOneCard.SuccessMoneyAdditionScreen.updatedBalance")}
                  </Typography.Text>
                  <Stack direction="horizontal" gap="16p" align="center" style={accountContainerStyle}>
                    {/* TODO: update after api getReady */}
                    <Image source={destination?.Logo} />
                    <SvgIcon uri={destination.Logo || ""} width={46} height={46} />
                    <Stack direction="vertical" gap="4p">
                      <Typography.Text color="supportBase-30" size="callout" weight="medium">
                        {destination.Name}
                      </Typography.Text>
                      <Stack direction="horizontal" align="center">
                        <FormattedPrice price={String(currentBalance)} color="supportBase-30" />
                        <Typography.Text color="neutralBase-10" size="caption1">
                          {destination.CurrencyCode}
                          {" " + t("AllInOneCard.SuccessMoneyAdditionScreen.available")}
                        </Typography.Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Button testID="AllInOneCard.SuccessMoneyAdditionScreen:DoneButton" color="dark" onPress={handleDone}>
            {t("AllInOneCard.SuccessMoneyAdditionScreen.doneButton")}
          </Button>
          {isAddMoney ? (
            <Button testID="AllInOneCard.SuccessMoneyAdditionScreen:AddButton" onPress={handleAddMoney}>
              {t("AllInOneCard.SuccessMoneyAdditionScreen.addButton")}
            </Button>
          ) : null}
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  accountContainer: {
    width: "100%",
  },
  container: { flex: 1 },
});
