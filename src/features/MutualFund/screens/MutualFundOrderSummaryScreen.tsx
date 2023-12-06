import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { TransactionArrowIcon } from "../assets/icons";
import { MutualFundOrderStepStatus } from "../components";
import { useMutualFundContext } from "../contexts/MutualFundContext";
import { useOrderStatusList } from "../hooks/query-hooks";

export default function MutualFundOrderSummaryScreen() {
  const { productId, accountNumber } = useMutualFundContext();

  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: orderStatusList } = useOrderStatusList();

  const handleOnPressCloseIcon = () => {
    navigation.goBack();
  };

  const handleOnViewFundPress = () => {
    navigation.navigate("MutualFund.ProductDetails", { id: productId });
  };

  //TODO: filter order list based on PortfolioDetails once BE team remove mocked data from api

  const orderSummaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    gap: theme.spacing["8p"],
  }));

  const orderContentBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={t("MutualFund.MutualFundOrderSummaryScreen.orderStatus")}
        end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnPressCloseIcon} />}
      />
      {orderStatusList !== undefined ? (
        <ScrollView style={{ flex: 1 }}>
          <ContentContainer style={orderContentBoxStyle}>
            <Stack direction="vertical" gap="16p" align="stretch">
              <Stack direction="vertical" gap="8p">
                <Typography.Text size="footnote" weight="regular">
                  {t("MutualFund.MutualFundOrderSummaryScreen.fundName")}
                </Typography.Text>
                <Typography.Text size="title3" weight="regular">
                  {orderStatusList.OrdersList[0].Product.Name}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" gap="8p">
                <Typography.Text size="footnote" weight="regular">
                  {t("MutualFund.MutualFundOrderSummaryScreen.accountNumber")}
                </Typography.Text>
                <Typography.Text size="title3" weight="medium">
                  {accountNumber}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" gap="8p">
                <Typography.Text size="footnote" weight="regular">
                  {t("MutualFund.MutualFundOrderSummaryScreen.investedAmount")}
                </Typography.Text>
                <Typography.Text size="title3" weight="medium">
                  {t("MutualFund.MutualFundDetailsScreen.sar", { value: orderStatusList.OrdersList[0].OrderAmount })}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Stack direction="vertical" gap="8p">
                  <Typography.Text size="footnote" weight="regular">
                    {t("MutualFund.MutualFundOrderSummaryScreen.transactionsType")}
                  </Typography.Text>
                  <Typography.Text size="title3" weight="medium">
                    {orderStatusList.OrdersList[0].OrderType}
                  </Typography.Text>
                </Stack>
                <TransactionArrowIcon />
              </Stack>
            </Stack>
            <Stack direction="vertical">
              <MutualFundOrderStepStatus
                title={t("MutualFund.MutualFundOrderSummaryScreen.transactionInitiated")}
                value={orderStatusList.OrdersList[0].CreationDateTime}
              />
              <MutualFundOrderStepStatus
                title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")}
                value={orderStatusList.OrdersList[0].UpdateDateTime}
              />
              <MutualFundOrderStepStatus
                hideLine
                title={t("MutualFund.MutualFundOrderSummaryScreen.transactionCompleted")}
                value={orderStatusList.OrdersList[0].TradeDateTime}
              />
            </Stack>
          </ContentContainer>
        </ScrollView>
      ) : null}

      <View style={orderSummaryButtonStyle}>
        <Button onPress={handleOnViewFundPress}>{t("MutualFund.MutualFundOrderSummaryScreen.viewFund")}</Button>
        <Button variant="tertiary" onPress={handleOnViewFundPress}>
          {t("MutualFund.MutualFundOrderSummaryScreen.done")}
        </Button>
      </View>
    </Page>
  );
}
