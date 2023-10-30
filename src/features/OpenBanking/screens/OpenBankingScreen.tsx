import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, View, ViewStyle } from "react-native";

import { CheckIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AccountCardItem, ConnectionCard } from "../components";
import { useGetConsent, usePushConsent } from "../hooks/query-hooks";
import { ConsentDataResponse } from "../types";

export default function OpenBankingScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [selectedAccountCards, setSelectedAccountCards] = useState<Record<string, boolean>>({});
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const consentData = useGetConsent().data ?? ({} as ConsentDataResponse);
  const { mutateAsync: connectConsent, isLoading } = usePushConsent();

  const handleCheckboxChange = (accountCardId: string) => (value: boolean) => {
    setSelectedAccountCards(prev => ({ ...prev, [accountCardId]: value }));
  };

  const handleOnConnect = async () => {
    // Create the values object with selected items
    const selectedAccounts = consentData.Accounts.filter(account => selectedAccountCards[account.Id.toString()]).map(
      account => ({ Id: parseInt(account.Id, 10), Type: account.Type })
    );

    const selectedCards = consentData.Cards.filter(card => selectedAccountCards[card.MaskedNumber.toString()]).map(
      card => ({ AccountNumber: card.AccountNumber, Type: card.Type })
    );

    const values = {
      ConsentId: consentData.ConsentId,
      DecisionId: 1,
      Accounts: selectedAccounts,
      Cards: selectedCards,
    };

    try {
      const response = await connectConsent(values);

      if (response.Status === "200") {
        navigation.navigate("OpenBanking.OpenBankingStack", {
          screen: "OpenBanking.LinkedSuccessfullyScreen",
        });
      } else if (response.Status === "401") {
        navigation.navigate("OpenBanking.OpenBankingStack", {
          screen: "OpenBanking.SessionExpiredScreen",
        });
      } else {
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setIsErrorModalOpen(true);
    }
  };

  const handleOnDeny = () => {
    // TODO handle it when api is ready
  };

  const isConnectButtonDisabled = Object.values(selectedAccountCards).every(value => !value);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    marginTop: theme.spacing["8p"],
  }));

  const containerAccountStyle = useThemeStyles<ViewStyle>(theme => ({
    marginStart: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
  }));

  const spacingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
    marginHorizontal: theme.spacing["24p"],
  }));

  const checkIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <ScrollView>
        <View style={containerStyle}>
          <Typography.Text size="title2" weight="medium">
            {t("OpenBanking.OpenBankingScreen.serviceProvider")}
          </Typography.Text>
          <Stack style={spacingStyle} direction="vertical" align="center">
            <Image source={require("../assets/images/top-logo.png")} />
          </Stack>
        </View>
        <Divider color="neutralBase-40" height={4} />
        <View style={containerStyle}>
          <Typography.Text size="title2" weight="medium">
            {t("OpenBanking.OpenBankingScreen.chooseAccpunts")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular" color="neutralBase+30">
            {t("OpenBanking.OpenBankingScreen.chooseYourAccount")}
          </Typography.Text>
        </View>

        {consentData.Accounts
          ? consentData.Accounts.map(account => (
              <View style={containerAccountStyle}>
                <AccountCardItem
                  key={account.Id}
                  accountCardId={account.Id.toString()}
                  selected={selectedAccountCards[account.Id.toString()] || false}
                  onCheckboxChange={handleCheckboxChange(account.Id.toString())}
                  cardText={account.Type}
                  maskedNumber={account.MaskedNumber}
                />
              </View>
            ))
          : null}

        {consentData.Cards
          ? consentData.Cards.map(card => (
              <AccountCardItem
                key={card.MaskedNumber}
                cardImageSource={
                  card.Type === "Credit"
                    ? require("../assets/images/bank-card-1.png")
                    : require("../assets/images/bank-card-2.png")
                }
                accountCardId={card.AccountNumber}
                selected={selectedAccountCards[card.MaskedNumber] || false}
                cardText={card.Type}
                onCheckboxChange={handleCheckboxChange(card.MaskedNumber.toString())}
                maskedNumber={card.MaskedNumber}
              />
            ))
          : null}

        <Divider color="neutralBase-40" height={4} />

        <Stack gap="12p" direction="vertical" style={containerStyle}>
          <Typography.Text color="neutralBase+30" size="title2" weight="medium">
            {t("OpenBanking.OpenBankingScreen.dataToBeShared")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("OpenBanking.OpenBankingScreen.info")}
          </Typography.Text>
          {consentData.DataGroupsList
            ? consentData.DataGroupsList.map((item, index) => (
                <Accordion
                  icon={<CheckIcon color={checkIconColor} width={16} height={16} />}
                  key={index}
                  title={i18n.language === "en" ? item.DataGroupNameEnglish : item.DataGroupNameArabic}
                  children={item.PermissionsList.map((Permission, dataIndex) => (
                    <Typography.Text size="footnote" color="neutralBase+10" weight="regular" key={dataIndex}>
                      {dataIndex + 1}.{" "}
                      {i18n.language === "en"
                        ? Permission.PermissionDescriptionEnglish
                        : Permission.PermissionDescriptionArabic}
                    </Typography.Text>
                  ))}
                />
              ))
            : null}
        </Stack>
        <Divider color="neutralBase-40" height={4} />

        <ConnectionCard
          connectionText={t("OpenBanking.OpenBankingScreen.firstConnected")}
          date={
            consentData.CreationDateTime ? format(parseISO(consentData.CreationDateTime), "dd/MM/yyyy") : "dd/MM/yyyy"
          }
        />
        <ConnectionCard
          connectionText={t("OpenBanking.OpenBankingScreen.connectionExpires")}
          date={
            consentData.ExpirationDateTime
              ? format(parseISO(consentData.ExpirationDateTime), "dd/MM/yyyy")
              : "dd/MM/yyyy"
          }
        />
        <View style={buttonsContainerStyle}>
          <Button loading={isLoading} variant="primary" disabled={isConnectButtonDisabled} onPress={handleOnConnect}>
            {t("OpenBanking.OpenBankingScreen.buttons.allow")}
          </Button>
          <Button onPress={() => setIsDenyModalOpen(true)} variant="tertiary">
            {t("OpenBanking.OpenBankingScreen.buttons.deny")}
          </Button>
        </View>
      </ScrollView>

      <NotificationModal
        variant="warning"
        title={t("OpenBanking.OpenBankingScreen.warningModal.title")}
        message={t("OpenBanking.OpenBankingScreen.warningModal.message")}
        buttons={{
          primary: <Button onPress={handleOnDeny}>{t("OpenBanking.OpenBankingScreen.warningModal.confirm")}</Button>,
          secondary: (
            <Button onPress={() => setIsDenyModalOpen(false)}>
              {t("OpenBanking.OpenBankingScreen.warningModal.cancel")}
            </Button>
          ),
        }}
        isVisible={isDenyModalOpen}
      />
      <NotificationModal
        variant="error"
        title={t("OpenBanking.OpenBankingScreen.errorModal.title")}
        message={t("OpenBanking.OpenBankingScreen.errorModal.message")}
        isVisible={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </Page>
  );
}
