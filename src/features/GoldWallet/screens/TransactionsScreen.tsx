import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import DefaultContent from "@/components/DefaultContent";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import noTransactionImage from "../assets/no-transactions-image.png";
import TransactionCard from "../components/TransactionCard";

export default function TransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const transactionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["8p"],
  }));

  const defaultContentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const openDetailsHandler = () => {
    navigation.navigate("GoldWallet.TransactionsDetailsModal");
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoldWallet.transactionsDetails")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <Stack direction="horizontal" align="center" justify="space-between" style={transactionsContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title1" weight="regular">
          {t("GoldWallet.transactions")}
        </Typography.Text>
      </Stack>
      <ContentContainer isScrollView>
        {/*TODO will add condition once we start integrate with api */}
        {true ? (
          Array.from({ length: 29 }, () => {
            return <TransactionCard isClickable openDetailsHandler={openDetailsHandler} />;
          })
        ) : (
          <Stack direction="vertical" justify="center" align="center" style={defaultContentStyle}>
            <DefaultContent
              title={t("GoldWallet.noTransactionTitle")}
              subtitle={t("GoldWallet.noTransactionSubtitle")}
              image={noTransactionImage}
            />
          </Stack>
        )}
      </ContentContainer>
    </Page>
  );
}
