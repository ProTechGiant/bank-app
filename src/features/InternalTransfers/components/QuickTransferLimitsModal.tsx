import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, InfoIcon } from "@/assets/icons";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface QuickTransferLimitsModalProps {
  onClose: () => void;
  onSwitchStandardTransferPress: () => void;
  isVisible: boolean;
}

export default function QuickTransferLimitsModal({
  onClose,
  onSwitchStandardTransferPress,
  isVisible,
}: QuickTransferLimitsModalProps) {
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
          {t("InternalTransfers.QuickTransferLimitsModal.title")}
        </Typography.Text>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("InternalTransfers.QuickTransferLimitsModal.standardTransfer")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.QuickTransferLimitsModal.standardTransferExplanation")}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("InternalTransfers.QuickTransferLimitsModal.quickTransfer")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.QuickTransferLimitsModal.quickTransferExplanation")}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("InternalTransfers.QuickTransferLimitsModal.nonWorkingDays")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.QuickTransferLimitsModal.nonWorkingDaysExplanation")}
          </Typography.Text>
        </Stack>
        <Pressable onPress={onSwitchStandardTransferPress} style={standardTransferBoxStyle}>
          <InfoIcon color={infoIconColor} height={18} width={18} />
          <View>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("InternalTransfers.QuickTransferLimitsModal.wantToSwitch")}
            </Typography.Text>
            <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
              {t("InternalTransfers.QuickTransferLimitsModal.switchToStandard")}
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
