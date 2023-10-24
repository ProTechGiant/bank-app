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
import { consentData } from "../mocks";

export default function OpenBankingScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [selectedAccountCards, setSelectedAccountCards] = useState<Record<string, boolean>>({});
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [isErorryModalOpen, setIsErorrModalOpen] = useState(false);

  const handleCheckboxChange = (accountCardId: string) => (value: boolean) => {
    setSelectedAccountCards(prev => ({ ...prev, [accountCardId]: value }));
  };

  const handleOnConnect = () => {
    // Create the values object with selected items
    const selectedAccounts = consentData.Accounts.filter(account => selectedAccountCards[account.Id.toString()]).map(
      account => ({ Id: account.Id, Type: account.Type })
    );

    const selectedCards = consentData.Cards.filter(card => selectedAccountCards[card.AccountNumber.toString()]).map(
      card => ({ AccountNumber: card.AccountNumber, Type: card.Type })
    );

    const values = {
      ConsentId: consentData.ConsentId,
      DecisionId: 1,
      Accounts: selectedAccounts,
      Cards: selectedCards,
    };

    // mocks for testing team
    if (values.Accounts.length === 2) {
      setIsErorrModalOpen(true);
    } else {
      navigation.navigate("OpenBanking.OpenBankingStack", {
        screen: "OpenBanking.LinkedSuccessfullyScreen",
      });
    }
    // TODO handle it when api is ready
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

        {consentData.Accounts.map(account => (
          <View style={containerAccountStyle}>
            <AccountCardItem
              key={account.Id}
              accountCardId={account.Id.toString()}
              selected={selectedAccountCards[account.Id.toString()] || false}
              onCheckboxChange={handleCheckboxChange(account.Id.toString())}
              cardText={account.Type}
            />
          </View>
        ))}

        {consentData.Cards.map(card => (
          <AccountCardItem
            key={card.AccountNumber}
            cardImageSource={
              card.Type === "Credit"
                ? require("../assets/images/bank-card-1.png")
                : require("../assets/images/bank-card-2.png")
            }
            accountCardId={card.AccountNumber}
            selected={selectedAccountCards[card.AccountNumber] || false}
            cardText={card.Type}
            onCheckboxChange={handleCheckboxChange(card.AccountNumber.toString())}
          />
        ))}

        <Divider color="neutralBase-40" height={4} />

        <Stack gap="12p" direction="vertical" style={containerStyle}>
          <Typography.Text color="neutralBase+30" size="title2" weight="medium">
            {t("OpenBanking.OpenBankingScreen.dataToBeShared")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("OpenBanking.OpenBankingScreen.info")}
          </Typography.Text>
          {consentData.GroupsListData.map((item, index) => (
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
          ))}
        </Stack>
        <Divider color="neutralBase-40" height={4} />

        <ConnectionCard
          connectionText={t("OpenBanking.OpenBankingScreen.firstConnected")}
          date={format(parseISO(consentData.CreationDateTime), "dd/MM/yyyy")}
        />
        <ConnectionCard
          connectionText={t("OpenBanking.OpenBankingScreen.connectionExpires")}
          date={format(parseISO(consentData.ExiprationDateTime), "dd/MM/yyyy")}
        />
        <View style={buttonsContainerStyle}>
          <Button variant="primary" disabled={isConnectButtonDisabled} onPress={handleOnConnect}>
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
        isVisible={isErorryModalOpen}
        onClose={() => setIsErorrModalOpen(false)}
      />
    </Page>
  );
}
