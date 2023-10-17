import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { AccountCardItem, ConnectionCard } from "../components";
import { consentData } from "../mocks";

export default function OpenBankingScreen() {
  const { t } = useTranslation();

  const [selectedAccountCards, setSelectedAccountCards] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (accountCardId: string) => (value: boolean) => {
    setSelectedAccountCards(prev => ({ ...prev, [accountCardId]: value }));
  };

  const handleOnConnect = () => {
    // Create arrays to store selected account IDs and card account numbers
    const selectedAccountIds = [];
    const selectedCardNumbers = [];

    // Iterate over selectedAccountCards to extract the selected items
    for (const key in selectedAccountCards) {
      if (selectedAccountCards[key]) {
        // Check if the item is selected (value is true)
        if (consentData.Accounts.some(account => account.Id.toString() === key)) {
          selectedAccountIds.push({ Id: parseInt(key) });
        }
        if (consentData.Cards.some(card => card.AccountNumber === key)) {
          selectedCardNumbers.push({ AccountNumber: key });
        }
      }
    }

    const values = {
      ConsentId: consentData.ConsentId,
      DecisionId: 1,
      Accounts: selectedAccountIds,
      Cards: selectedCardNumbers,
    };
    // TODO handle it when api is ready
    console.log(values);
  };

  const handleOnDeny = () => {
    // TODO handle it when api is ready
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
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

        <ConnectionCard
          connectionText={t("OpenBanking.OpenBankingScreen.firstConnected")}
          date={format(parseISO(consentData.CreationDateTime), "dd/MM/yyyy")}
        />
        <ConnectionCard
          connectionText={t("OpenBanking.OpenBankingScreen.connectionExpires")}
          date={format(parseISO(consentData.ExiprationDateTime), "dd/MM/yyyy")}
        />
        <View style={buttonsContainerStyle}>
          <Button variant="primary" onPress={handleOnConnect}>
            {t("OpenBanking.OpenBankingScreen.buttons.allow")}
          </Button>
          <Button onPress={handleOnDeny} variant="tertiary">
            {t("OpenBanking.OpenBankingScreen.buttons.deny")}
          </Button>
        </View>
      </ScrollView>
    </Page>
  );
}
