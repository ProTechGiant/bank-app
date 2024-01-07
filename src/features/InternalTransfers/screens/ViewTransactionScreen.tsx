//import { format, parse } from "date-fns";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Share from "react-native-share";
import ViewShot, { captureRef } from "react-native-view-shot";

import { SplitIcon } from "@/assets/icons";
import { SettingsToggle, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import DetailedRow from "@/components/DetailedRow";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useSingleTransaction } from "@/hooks/use-single-transaction";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

export default function ViewTransactionScreen() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { data: single_transaction } = useSingleTransaction("BNK24153KJGJDFM0");
  //TODO: need to add dynamic value once get from response of successfull transaction
  const { recipient } = useInternalTransferContext();

  //TODO: need to update the date format after correction value from response, right now correct formate is missing.

  //const inputArray: number[] = single_transaction?.BookingDateTime || [];
  //const inputDate = new Date(inputArray[0], inputArray[1] - 1, inputArray[2], inputArray[3], inputArray[4]);
  //const formattedDate = format(inputDate, "EEE d MMMM, HH:mm", { locale: require("date-fns/locale/en-US") });

  const onHandleTagPress = () => {
    //TODO: will be handle on next build cycle
  };
  const onHandleCategoryPress = () => {
    //TODO: will be handle on next build cycle
  };

  const onHandleExcludeFromSummaryToggle = () => {
    //TODO: will be handle on next build cycle
  };

  const onHandleSplitWithFriendsPress = () => {
    //TODO: will be handle on next build cycle
  };

  const onHandleShareIconPress = async () => {
    try {
      const screenshotURI = await captureRef(ref, {
        format: "jpg",
        quality: 0.8,
      });
      await Share.open({ url: screenshotURI });
    } catch (error) {
      const typedError = error as Error;
      warn("Error capturing screenshot:", typedError.message);
    }
  };

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
    width: "90%",
    alignSelf: "center",
  }));

  const transactionInfoContainerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["32p"],
  }));
  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    marginVertical: 40,
  }));

  const transactionDetailContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    flex: 1,
    justifyContent: "space-between",
    rowGap: 10,
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title=""
          end={<NavHeader.ShareButton onPress={onHandleShareIconPress} />}
          testID="InternalTransfers.ViewTransactionsScreen:NavHeader"
        />
        <ViewShot ref={ref} style={styles.container}>
          <View style={transactionInfoContainerViewStyle}>
            <Stack direction="vertical" gap="12p">
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {recipient.accountName}
              </Typography.Text>
              <Typography.Text color="neutralBase-10" weight="regular" size="callout">
                {recipient.iban}
              </Typography.Text>
              <Stack direction="horizontal" gap="4p">
                <Typography.Text color="neutralBase+30" weight="medium" size="title3">
                  {single_transaction?.Amount}
                </Typography.Text>
                <Typography.Text color="neutralBase+10" weight="medium" size="title3">
                  SAR
                </Typography.Text>
              </Stack>
            </Stack>
          </View>

          <View style={separatorStyle} />
          <ScrollView>
            <View style={transactionDetailContainerStyle}>
              <DetailedRow name={t("InternalTransfers.ViewTransactionScreen.transactionType")} value={recipient.type} />
              <DetailedRow name={t("InternalTransfers.ViewTransactionScreen.BankName")} value={recipient.bankName} />
              <DetailedRow name={t("InternalTransfers.ViewTransactionScreen.FeeInclusive")} value="" />
              <DetailedRow name={t("InternalTransfers.ViewTransactionScreen.PurposeOfTransfer")} value="" />
              <DetailedRow
                name={t("InternalTransfers.ViewTransactionScreen.ReferenceNo")}
                value={single_transaction?.TransactionId}
              />
              {/* // TODO: as this will be handled on next build cycle */}
              <DetailedRow
                name={t("InternalTransfers.ViewTransactionScreen.Tags")}
                value=""
                showIcon={true}
                onPress={onHandleTagPress}
              />
              <DetailedRow
                name={t("InternalTransfers.ViewTransactionScreen.Category")}
                value=""
                showIcon={true}
                onPress={onHandleCategoryPress}
              />
              <SettingsToggle
                label={t("InternalTransfers.ViewTransactionScreen.ExcludeFromSummary.title")}
                helperText={t("InternalTransfers.ViewTransactionScreen.ExcludeFromSummary.message")}
                onPress={onHandleExcludeFromSummaryToggle}
                value={false}
                testID="InternalTransfers.ViewTransactionScreen:ExcludeFromSettingsToggel"
              />
            </View>
          </ScrollView>
        </ViewShot>
        <Stack align="stretch" direction="vertical" style={buttonsContainerStyle}>
          <Button variant="primary" iconLeft={<SplitIcon />} onPress={onHandleSplitWithFriendsPress}>
            {t("InternalTransfers.ViewTransactionScreen.splitWithFriendsButton")}
          </Button>
        </Stack>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
});
