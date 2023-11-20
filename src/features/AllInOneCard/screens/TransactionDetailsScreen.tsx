import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CopyIcon, ThreeDotsIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import TransactionDetailsImage from "../assets/images/TransactionDetailsImage.png";
import { TransactionDetailsItem, TransactionDetailsModal } from "../components";

export default function TransactionDetailsScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.TransactionDetailsScreen">>();
  const { transactionDetails } = route.params;
  const { t } = useTranslation();
  const addToast = useToasts();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCopyReferenceNo = (item: string | undefined) => {
    if (item !== undefined) Clipboard.setString(item);
    addToast({
      icon: <CopyIcon color={copyIconColor} />,
      variant: "success",
      message: `${item} ${t("AllInOneCard.TransactionDetailsScreen.copyToastMessage")}`,
      position: "top",
    });
  };
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
  }));

  const transactionContentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  const copyIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page backgroundColor="neutralBase-60">
      <View style={headerStyle}>
        <NavHeader
          withBackButton
          end={
            <Pressable onPress={handleOpenModal}>
              <ThreeDotsIcon width="36" height="36" color="#000" />
            </Pressable>
          }
        />
        <ContentContainer>
          <Stack direction="horizontal" justify="space-between" gap="16p">
            <Typography.Text size="title1" weight="medium" color="neutralBase+30" style={styles.textShrink}>
              {transactionDetails.MerchantName}
            </Typography.Text>
            <Typography.Text>
              <Typography.Text size="title3" weight="medium" color="neutralBase+30">
                {transactionDetails.Amount}
              </Typography.Text>
              <Typography.Text size="title3" weight="regular" color="neutralBase+10">
                {" " + t("AllInOneCard.TransactionDetailsScreen.sar")}
              </Typography.Text>
            </Typography.Text>
          </Stack>
        </ContentContainer>
      </View>
      <Image resizeMode="contain" source={TransactionDetailsImage} />

      <View style={containerStyle}>
        <TransactionDetailsItem
          label={t("AllInOneCard.TransactionDetailsScreen.type")}
          value={transactionDetails.TransactionType}
        />
        <TransactionDetailsItem
          label={t("AllInOneCard.TransactionDetailsScreen.date")}
          value={transactionDetails.TransactionDate}
        />
        <View style={transactionContentStyle}>
          <Stack direction="horizontal" justify="space-between" align="center">
            <TransactionDetailsItem
              label={t("AllInOneCard.TransactionDetailsScreen.referenceNo")}
              value={transactionDetails.TransactionReferenceNumber}
            />
            <Pressable onPress={() => handleCopyReferenceNo(transactionDetails?.TransactionReferenceNumber)}>
              <CopyIcon color={copyIconColor} />
            </Pressable>
          </Stack>
        </View>
        <TransactionDetailsItem
          label={t("AllInOneCard.TransactionDetailsScreen.location")}
          value={transactionDetails.Location}
        />
        <TransactionDetailsItem
          label={t("AllInOneCard.TransactionDetailsScreen.currency")}
          value={transactionDetails.Currency}
        />
        <TransactionDetailsItem
          label={t("AllInOneCard.TransactionDetailsScreen.authNo")}
          value={transactionDetails.AuthCode}
        />
      </View>
      <TransactionDetailsModal isModalVisible={isModalVisible} onCloseModal={handleCloseModal} />
    </Page>
  );
}

const styles = StyleSheet.create({
  textShrink: {
    flexShrink: 1,
  },
});
