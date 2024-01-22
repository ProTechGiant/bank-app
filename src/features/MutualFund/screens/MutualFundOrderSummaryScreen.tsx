import { RouteProp, useRoute } from "@react-navigation/native";
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
import { MutualFundStackParams } from "../MutualFundStack";

export default function MutualFundOrderSummaryScreen() {
  const { productId } = useMutualFundContext();
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.MutualFundOrderSummaryScreen">>();
  const status = route.params.status;
  const { t } = useTranslation();
  const navigation = useNavigation();

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
    gap: theme.spacing["48p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={t("MutualFund.MutualFundOrderSummaryScreen.orderDetails")}
        end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnPressCloseIcon} />}
      />

      <ScrollView style={{ flex: 1 }}>
        <ContentContainer style={orderContentBoxStyle}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Stack direction="vertical" gap="8p">
              <Typography.Text size="footnote" weight="regular" color="neutralBase">
                {t("MutualFund.MutualFundOrderSummaryScreen.fundName")}
              </Typography.Text>
              <Typography.Text size="callout" weight="regular">
                {route.params.fundName}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" gap="8p">
              <Typography.Text size="footnote" weight="regular" color="neutralBase">
                {t("MutualFund.MutualFundOrderSummaryScreen.accountNumber")}
              </Typography.Text>
              <Typography.Text size="callout" weight="regular">
                {route.params.investedValue}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" gap="8p">
              <Typography.Text size="footnote" weight="regular" color="neutralBase">
                {t("MutualFund.MutualFundOrderSummaryScreen.investedAmount")}
              </Typography.Text>
              <Typography.Text size="callout" weight="regular">
                {t("MutualFund.MutualFundDetailsScreen.sar", { value: route.params.investedValue })}
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Stack direction="vertical" gap="8p">
                <Typography.Text size="footnote" weight="regular" color="neutralBase">
                  {t("MutualFund.MutualFundOrderSummaryScreen.transactionsType")}
                </Typography.Text>
                <Typography.Text size="callout" weight="regular">
                  {route.params.transactionsType ? route.params.transactionsType : route.params.status}
                </Typography.Text>
              </Stack>
              <TransactionArrowIcon />
            </Stack>
          </Stack>
          <Stack direction="vertical">
            {status === "Completed" ? (
              <>
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionInitiated")} />
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")} />
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")} />
                <MutualFundOrderStepStatus
                  hideLine
                  title={t("MutualFund.MutualFundOrderSummaryScreen.transactionCompleted")}
                />
              </>
            ) : status === "Pending" ? (
              <>
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionInitiated")} />
                <MutualFundOrderStepStatus
                  title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")}
                  disabled
                />
                <MutualFundOrderStepStatus
                  title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")}
                  disabled
                />
                <MutualFundOrderStepStatus
                  hideLine
                  title={t("MutualFund.MutualFundOrderSummaryScreen.transactionCompleted")}
                  disabled
                />
              </>
            ) : (
              <>
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionInitiated")} />
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")} />
                <MutualFundOrderStepStatus title={t("MutualFund.MutualFundOrderSummaryScreen.transactionProgress")} />
                <MutualFundOrderStepStatus
                  hideLine
                  title={t("MutualFund.MutualFundOrderSummaryScreen.transactionCompleted")}
                  isError
                />
              </>
            )}
          </Stack>
        </ContentContainer>
      </ScrollView>

      <View style={orderSummaryButtonStyle}>
        {status === "Completed" ? (
          <Button onPress={handleOnViewFundPress}>{t("MutualFund.MutualFundOrderSummaryScreen.viewFund")}</Button>
        ) : null}
      </View>
    </Page>
  );
}
