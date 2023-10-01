import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View } from "react-native";
import { ViewStyle } from "react-native/types";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function OrderNewCardSummaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

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

  const orderSummaryItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["12p"],
    borderWidth: 1,
    marginTop: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
    paddingBottom: theme.spacing["8p"],
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

  const renderSeparator = () => {
    return <View style={separatorStyle} />;
  };

  const renderOrderSummaryItem = (title: string, value: string) => {
    return (
      <Stack direction="horizontal" justify="space-between" style={styles.orderSummaryItemContainerStyle}>
        <Typography.Text color="neutralBase" style={summaryTitleStyle} weight="regular" size="footnote">
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase" style={summaryTitleStyle} weight="regular" size="footnote">
          {value}
        </Typography.Text>
      </Stack>
    );
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClose} />} />
        <ContentContainer>
          <Typography.Header color="neutralBase+30" size="medium" weight="medium" style={titleStyle}>
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
              t("CardActions.OrderNewCardSummaryScreen.issuanceFeeAmount")
            )}
            {renderSeparator()}

            {renderOrderSummaryItem(
              t("CardActions.OrderNewCardSummaryScreen.deliveryFee"),
              t("CardActions.OrderNewCardSummaryScreen.deliveryFeeAmount")
            )}
            {renderSeparator()}

            {renderOrderSummaryItem(
              t("CardActions.OrderNewCardSummaryScreen.totalFee"),
              t("CardActions.OrderNewCardSummaryScreen.totalFeeAmount")
            )}
          </View>
        </ContentContainer>
        <View style={orderSummaryContainerStyle}>
          <Button
            onPress={() => {
              // todo: hanlde on press done
            }}>
            {t("CardActions.OrderNewCardSummaryScreen.done")}
          </Button>
        </View>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  orderSummaryItemContainerStyle: { marginHorizontal: 12, marginVertical: 12 },
});
