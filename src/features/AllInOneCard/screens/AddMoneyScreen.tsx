import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { AccountSelector, EnterAmountSection, SelectDestinationModal, SelectSourceModal } from "../components";
import { CURRENCY_ID } from "../constants";
import { destinationAccounts, sourceAccounts } from "../mocks";
import { Account, CurrenciesType } from "../types";

export default function AddMoneyScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.AddMoneyScreen">>();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isSourceExpanded, setIsSourceExpanded] = useState<boolean>(false);
  const [isDestinationExpanded, setIsDestinationExpanded] = useState<boolean>(false);
  const [currentSource, setCurrentSource] = useState<Account>(sourceAccounts[0]);
  const [currentDestination, setCurrentDestination] = useState<Account | CurrenciesType>(
    route.params?.destination ? route.params.destination : destinationAccounts[1]
  );
  const [amount, setAmount] = useState<number>(0);

  const handleOpenSourceModal = () => setIsSourceExpanded(true);
  const handleOpenDestinationModal = () => setIsDestinationExpanded(true);
  const handleCloseSourceModal = () => setIsSourceExpanded(false);
  const handleCloseDestinationModal = () => setIsDestinationExpanded(false);

  const handleOnSubmitPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.AddMoneySummaryScreen",
      params: {
        source: currentSource.Name,
        destination: currentDestination,
        amount: amount,
        sourceCurrency: "SAR",
        destinationCurrency: CURRENCY_ID in currentDestination ? currentDestination.CurrencyCode : "SAR",
      },
    });
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.AddMoneyScreen:Page">
      <NavHeader
        testID="AllInOneCard.AddMoneyScreen:NavHeader"
        title={t("AllInOneCard.AddMoneyScreen.title")}
        end={
          <CloseEndButton
            onPress={() => {
              navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.Dashboard" });
            }}
          />
        }
      />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
        <View>
          <ContentContainer>
            <Stack direction="vertical" align="stretch" justify="space-between" gap="16p">
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {t("AllInOneCard.AddMoneyScreen.from")}
              </Typography.Text>
              <AccountSelector
                testID="AllInOneCard.AddMoneyScreen:SourceSelector"
                selectedCard={currentSource}
                openModal={handleOpenSourceModal}
              />
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {t("AllInOneCard.AddMoneyScreen.to")}
              </Typography.Text>
              <AccountSelector
                testID="AllInOneCard.AddMoneyScreen:DestinationSelector"
                selectedCard={currentDestination}
                openModal={handleOpenDestinationModal}
              />
            </Stack>
          </ContentContainer>

          <EnterAmountSection
            totalBalance={parseFloat(currentSource.Amount)}
            setAmount={setAmount}
            sourceCurrency="SAR"
            destinationCurrency={CURRENCY_ID in currentDestination ? currentDestination.CurrencyCode : "SAR"}
          />
        </View>

        <View style={buttonContainerStyle}>
          <Button
            disabled={amount <= 0 || amount > parseFloat(currentSource.Amount)}
            testID="AllInOneCard.AddMoneyScreen:confirmButton"
            onPress={handleOnSubmitPress}>
            {t("AllInOneCard.AddMoneyScreen.confirmButton")}
          </Button>
        </View>
      </Stack>
      <SelectSourceModal
        onClose={handleCloseSourceModal}
        isSourceModalVisible={isSourceExpanded}
        onSelectSource={setCurrentSource}
        Sources={sourceAccounts.filter((item: Account) => item.ID !== currentDestination?.ID)}
      />
      <SelectDestinationModal
        isDestinationModalVisible={isDestinationExpanded}
        onClose={handleCloseDestinationModal}
        onSelectDestination={setCurrentDestination}
        destinationAccounts={destinationAccounts.filter((item: Account) => item.ID !== currentSource.ID)}
      />
    </Page>
  );
}
