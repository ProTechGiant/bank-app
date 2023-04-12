import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function ConfirmationScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnDonePress = () => {
    navigation.navigate("Home.HomeStack", { screen: "Home.DashboardScreen" });
  };

  const handleOnViewTransactionsPress = () => {
    navigation.navigate("InternalTransfers.TransactionDetailsScreen");
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
      <Page backgroundColor="primaryBase">
        <ContentContainer isScrollView style={styles.flex}>
          <View style={styles.container}>
            <View style={iconStyle}>
              <TickCircleIcon height={66} width={66} color={iconColor} />
            </View>
            <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
              {t("InternalTransfers.ConfirmationScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase-20" align="center" style={messageStyle}>
              {t("InternalTransfers.ConfirmationScreen.message")}
            </Typography.Text>
          </View>
          <TableListCardGroup background="dark">
            <TableListCard
              isGrouped
              caption={t("InternalTransfers.ConfirmationScreen.transferredTo")}
              label="Ahmed Abdul Aziz" // TODO: BE integration
              background="dark"
            />
            <TableListCard
              isGrouped
              caption={t("InternalTransfers.ConfirmationScreen.amount")}
              label="5,000 SAR" // TODO: BE integration
              background="dark"
            />
          </TableListCardGroup>
          <Stack align="stretch" direction="vertical" gap="8p" style={styles.buttonContainer}>
            <Button color="dark" variant="primary" onPress={handleOnDonePress}>
              {t("InternalTransfers.ConfirmationScreen.buttons.done")}
            </Button>
            <Button color="dark" variant="tertiary" onPress={handleOnViewTransactionsPress}>
              {t("InternalTransfers.ConfirmationScreen.buttons.viewTransaction")}
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
