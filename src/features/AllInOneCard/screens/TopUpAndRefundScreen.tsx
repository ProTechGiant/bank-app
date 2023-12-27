import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, View } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { AccountPickerModal, AccountSelector, EnterAmountSection } from "../components";
import { sourceAndDestinationAccounts } from "../mocks";
import { Account } from "../types";
import { AddRefundType } from "../utils";

export default function TopUpAndRefundScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.TopUpAndRefundScreen">>();
  const { actionType, account } = route.params;

  const receivedAccount = account
    ? {
        ID: account.CurrencyID,
        Logo: account.CurrencyLogo,
        Name: account.CurrencyName,
        Balance: account.CurrencyBalance,
        CurrencyCode: account.CurrencyCode,
      }
    : undefined;
  const isAddMoney: boolean = actionType === AddRefundType.ADD_MONEY;

  const initialSource = isAddMoney
    ? sourceAndDestinationAccounts[0]
    : receivedAccount
    ? receivedAccount
    : sourceAndDestinationAccounts[1];

  const initialDestination = isAddMoney
    ? receivedAccount
      ? receivedAccount
      : sourceAndDestinationAccounts[1]
    : sourceAndDestinationAccounts[0];

  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isSourceExpanded, setIsSourceExpanded] = useState<boolean>(false);
  const [isDestinationExpanded, setIsDestinationExpanded] = useState<boolean>(false);
  const [currentSource, setCurrentSource] = useState<Account>(initialSource);
  const [currentDestination, setCurrentDestination] = useState<Account>(initialDestination);

  const handleOpenSourceModal = () => setIsSourceExpanded(true);
  const handleOpenDestinationModal = () => setIsDestinationExpanded(true);
  const handleCloseSourceModal = () => setIsSourceExpanded(false);
  const handleCloseDestinationModal = () => setIsDestinationExpanded(false);

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.TopUpAndRefundScreen:Page">
      <NavHeader
        testID="AllInOneCard.TopUpAndRefundScreen:NavHeader"
        title={
          isAddMoney
            ? t("AllInOneCard.TopUpAndRefundScreen.addMoney")
            : t("AllInOneCard.TopUpAndRefundScreen.refundMoney")
        }
        end={<CloseEndButton onPress={() => navigation.navigate("Home.HomeTabs", { screen: "Cards" })} />}
      />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <Stack direction="vertical" justify="space-between" align="stretch">
        <View>
          <ContentContainer>
            <Stack direction="vertical" align="stretch" justify="space-between" gap="16p">
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {t("AllInOneCard.TopUpAndRefundScreen.from")}
              </Typography.Text>
              <AccountSelector
                testID="AllInOneCard.TopUpAndRefundScreen:SourceSelector"
                selectedCard={currentSource}
                openModal={handleOpenSourceModal}
              />
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {t("AllInOneCard.TopUpAndRefundScreen.to")}
              </Typography.Text>
              {isAddMoney ? (
                <AccountSelector
                  testID="AllInOneCard.TopUpAndRefundScreen:AddMoneyDestinationSelector"
                  selectedCard={currentDestination}
                  openModal={handleOpenDestinationModal}
                />
              ) : (
                <AccountSelector
                  testID="AllInOneCard.TopUpAndRefundScreen:RefundDestinationSelector"
                  selectedCard={currentDestination}
                  editable={false}
                />
              )}
            </Stack>
          </ContentContainer>

          <EnterAmountSection type={actionType} source={currentSource} destination={currentDestination} />
        </View>
      </Stack>

      <AccountPickerModal
        modalTitle={t("AllInOneCard.TopUpAndRefundScreen.selectSource")}
        onClose={handleCloseSourceModal}
        isVisible={isSourceExpanded}
        accounts={sourceAndDestinationAccounts.filter(item => item.ID !== currentDestination?.ID)}
        onSelectAccount={setCurrentSource}
        isForeignCurrencyVisible={!isAddMoney}
      />

      <AccountPickerModal
        modalTitle={t("AllInOneCard.TopUpAndRefundScreen.selectDestination")}
        onClose={handleCloseDestinationModal}
        isVisible={isDestinationExpanded}
        accounts={sourceAndDestinationAccounts.filter(item => item.ID !== currentSource.ID)}
        onSelectAccount={setCurrentDestination}
        isForeignCurrencyVisible={true}
      />
    </Page>
  );
}
