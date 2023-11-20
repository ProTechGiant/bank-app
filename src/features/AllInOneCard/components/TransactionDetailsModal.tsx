import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import useThemeStyles from "@/theme/use-theme-styles";

import { ArticleIcon, ShareIcon, StarIcon } from "../assets/icons";

interface TransactionDetailsModalProps {
  isModalVisible: boolean;
  onCloseModal: () => void;
}

export default function TransactionDetailsModal({ isModalVisible, onCloseModal }: TransactionDetailsModalProps) {
  const { t } = useTranslation();

  const handleShare = async () => {
    onCloseModal();
    //TODO: Capture screen shot and Share it
  };

  const modalItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
    width: "100%",
  }));
  const modalContentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#ededed",
    borderRadius: theme.radii.small,
    width: 254,
    marginRight: theme.spacing["16p"],
    marginTop: theme.spacing["48p"],
  }));

  return (
    <Modal transparent={true} animationType="fade" visible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={modalContentStyle}>
          <Stack direction="vertical" align="stretch">
            <Stack direction="horizontal" justify="space-between" align="center" style={modalItemContainerStyle}>
              <Typography.Text size="body" weight="regular" color="neutralBase+30">
                {t("AllInOneCard.TransactionDetailsScreen.transactionDetailsModal.splitBill")}
              </Typography.Text>
              <ArticleIcon />
            </Stack>
            <Divider color="neutralBase-30" />
            <Stack direction="horizontal" justify="space-between" align="center" style={modalItemContainerStyle}>
              <Typography.Text size="body" weight="regular" color="neutralBase+30">
                {t("AllInOneCard.TransactionDetailsScreen.transactionDetailsModal.dispute")}
              </Typography.Text>
              <StarIcon />
            </Stack>
            <Divider color="neutralBase-30" />
            <Pressable onPress={handleShare}>
              <Stack direction="horizontal" justify="space-between" align="center" style={modalItemContainerStyle}>
                <Typography.Text size="body" weight="regular" color="neutralBase+30">
                  {t("AllInOneCard.TransactionDetailsScreen.transactionDetailsModal.share")}
                </Typography.Text>
                <ShareIcon />
              </Stack>
            </Pressable>
          </Stack>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
});
