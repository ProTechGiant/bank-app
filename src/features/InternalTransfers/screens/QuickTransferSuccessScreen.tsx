import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

export default function QuickTransferSuccessScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.QuickTransferSuccessScreen">>();

  const handleOnDonePress = () => {
    navigation.navigate("Transfers.TrasnfersLandingScreen");
  };

  const handleOnViewTransactionsPress = () => {
    //TODO: navigate to transaction details
    handleOnDonePress();
  };

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: 80,
    marginBottom: theme.spacing["24p"],
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const messageStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Page backgroundColor="primaryBase">
        <ContentContainer isScrollView style={styles.flex}>
          <View style={styles.container}>
            <View style={iconStyle}>
              <TickCircleIcon height={66} width={66} color={iconColor} />
            </View>
            <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
              {t("InternalTransfers.QuickTransferSuccessScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase-20" align="center" style={messageStyle}>
              {t("InternalTransfers.QuickTransferSuccessScreen.message")}
            </Typography.Text>
          </View>
          <List isBordered variant="dark">
            <List.Item.Table
              caption={t("InternalTransfers.QuickTransferSuccessScreen.transferredTo")}
              label={route.params.BeneficiaryFullName}
            />
            <List.Item.Table
              caption={t("InternalTransfers.QuickTransferSuccessScreen.amount")}
              label={formatCurrency(route.params.PaymentAmount, "SAR")}
            />
          </List>
          <Stack align="stretch" direction="vertical" gap="8p" style={styles.buttonContainer}>
            <Button color="dark" variant="primary" onPress={handleOnDonePress}>
              {t("InternalTransfers.QuickTransferSuccessScreen.buttons.done")}
            </Button>
            <Button color="dark" variant="tertiary" onPress={handleOnViewTransactionsPress}>
              {t("InternalTransfers.QuickTransferSuccessScreen.buttons.viewTransaction")}
            </Button>
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
  container: {
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
});
