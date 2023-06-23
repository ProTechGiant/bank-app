import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, InfoIcon } from "@/assets/icons";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TransferTypeCode } from "../types";

interface TransferLimitsModalProps {
  onClose: () => void;
  onSwitchStandardTransferPress: () => void;
  isVisible: boolean;
  transferType: TransferTypeCode;
}

export default function TransferLimitsModal({
  onClose,
  onSwitchStandardTransferPress,
  isVisible,
  transferType,
}: TransferLimitsModalProps) {
  const { t } = useTranslation();

  const standardTransferBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    columnGap: theme.spacing["16p"],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["12p"],
    width: "100%",
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const arrowIconColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  return (
    <Modal onClose={onClose} visible={isVisible}>
      <Stack direction="vertical" gap="20p">
        <Typography.Text color="neutralBase+30" size="title2" weight="medium">
          {t("InternalTransfers.TransferLimitsModal.title")}
        </Typography.Text>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("InternalTransfers.TransferLimitsModal.standardTransfer")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.TransferLimitsModal.standardTransferExplanation")}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("InternalTransfers.TransferLimitsModal.quickTransfer")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.TransferLimitsModal.quickTransferExplanation")}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("InternalTransfers.TransferLimitsModal.nonWorkingDays")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.TransferLimitsModal.nonWorkingDaysExplanation")}
          </Typography.Text>
        </Stack>
        <Pressable onPress={onSwitchStandardTransferPress} style={standardTransferBoxStyle}>
          <InfoIcon color={infoIconColor} height={18} width={18} />
          <View>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {transferType === TransferTypeCode.LocalTransferIPS
                ? t("InternalTransfers.TransferLimitsModal.wantToSwitch")
                : t("InternalTransfers.StandardTransferScreen.wantToSwitch")}
            </Typography.Text>
            <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
              {transferType === TransferTypeCode.LocalTransferIPS
                ? t("InternalTransfers.TransferLimitsModal.switchToStandard")
                : t("InternalTransfers.StandardTransferScreen.switchToQuick")}
            </Typography.Text>
          </View>
          <View style={styles.chevron}>
            <ChevronRightIcon color={arrowIconColor} height={24} width={24} />
          </View>
        </Pressable>
      </Stack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chevron: {
    justifyContent: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
