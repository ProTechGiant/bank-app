import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View } from "react-native";
import { ViewStyle } from "react-native/types";

import { TransferErrorBox } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../CardActionsStack";

export default function OrderNewCardSummaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.OrderNewCardSummaryScreen">>();

  const handleOnDonePress = route.params.onDonePress;

  const account = useCurrentAccount();
  const currentBalance = account.data?.balance ?? 0;

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));
  const summaryTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const summaryDescriptionStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    color: theme.palette["neutralBase+30"],
    marginBottom: theme.spacing["8p"],
  }));

  const orderSummaryContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
  }));

  const insufficientFundsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    marginHorizontal: -theme.spacing["20p"],
  }));

  const orderSummaryItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["12p"],
    borderWidth: 1,
    marginTop: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
    paddingBottom: theme.spacing["8p"],
  }));

  const orderSummaryItemStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginVertical: theme.spacing["12p"],
  }));

  const orderSumarySpacingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 0.5,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["8p"],
  }));

  const handleOnClose = () => {
    navigation.goBack();
  };

  const handleOnAddFundsPress = () => {
    navigation.goBack();

    navigation.navigate("AddMoney.AddMoneyStack", {
      screen: "AddMoney.AddMoneyInfoScreen",
    });
  };

  const renderSeparator = () => {
    return <View style={separatorStyle} />;
  };

  const renderOrderSummaryItem = (title: string, value: string, isAmountBold: boolean) => {
    return (
      <Stack direction="horizontal" justify="space-between" style={orderSummaryItemStyle}>
        <Typography.Text color="neutralBase" style={summaryTitleStyle} weight="regular" size="footnote">
          {title}
        </Typography.Text>
        <Typography.Text
          color={isAmountBold ? "neutralBase+30" : "neutralBase"}
          style={summaryTitleStyle}
          weight={isAmountBold ? "bold" : "regular"}
          size="footnote">
          {value}
        </Typography.Text>
      </Stack>
    );
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          withBackButton={true}
          end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
          testID="CardActions.OrderNewCardSummaryScreen:NavHeader"
        />
        <ContentContainer>
          <Typography.Header color="neutralBase+30" size="large" weight="medium" style={titleStyle}>
            {t("CardActions.OrderNewCardSummaryScreen.orderSummary")}
          </Typography.Header>

          <View style={orderSummaryItemContainerStyle}>
            <View style={orderSumarySpacingContainerStyle}>
              <Typography.Text color="neutralBase" style={summaryTitleStyle} weight="regular" size="footnote">
                {t("CardActions.OrderNewCardSummaryScreen.chargedFrom")}
              </Typography.Text>
              <Typography.Text style={summaryDescriptionStyle} weight="regular" size="callout">
                {t("CardActions.OrderNewCardSummaryScreen.mainCrotiaAccount")}
              </Typography.Text>
            </View>
            {renderSeparator()}

            {renderOrderSummaryItem(
              t("CardActions.OrderNewCardSummaryScreen.issuanceFee"),
              t("CardActions.OrderNewCardSummaryScreen.issuanceFeeAmount"),
              false
            )}
            {renderSeparator()}

            {renderOrderSummaryItem(
              t("CardActions.OrderNewCardSummaryScreen.deliveryFee"),
              t("CardActions.OrderNewCardSummaryScreen.deliveryFeeAmount"),
              false
            )}
            {renderSeparator()}

            {renderOrderSummaryItem(
              t("CardActions.OrderNewCardSummaryScreen.totalFee"),
              t("CardActions.OrderNewCardSummaryScreen.totalFeeAmount"),
              true
            )}
          </View>
          {currentBalance <= 0 ? (
            <View style={insufficientFundsContainerStyle}>
              <ContentContainer>
                <TransferErrorBox
                  onPress={handleOnAddFundsPress}
                  textStart={t("CardActions.OrderNewCardSummaryScreen.insufficientFundsTitle")}
                  textEnd={t("CardActions.OrderNewCardSummaryScreen.addFunds")}
                  hasButton={true}
                />
              </ContentContainer>
            </View>
          ) : null}
        </ContentContainer>

        <View style={orderSummaryContainerStyle}>
          <Button
            testID="CardActions.OrderNewCardSummaryScreen:DoneButton"
            disabled={currentBalance <= 0}
            onPress={handleOnDonePress}>
            {t("CardActions.OrderNewCardSummaryScreen.done")}
          </Button>
        </View>
      </Page>
    </>
  );
}
