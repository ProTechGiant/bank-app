import { useTranslation } from "react-i18next";
import { StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { TransferLimitResponse } from "@/hooks/use-transfer-limit";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { getMinimumTransferLimit } from "../utils";

interface TransferLimitsModalProps {
  onClose: () => void;
  isVisible: boolean;
  testID?: string;
  limitData?: TransferLimitResponse;
  isError: boolean;
}

export default function TransferLimitsModal({
  onClose,
  isVisible,
  testID,
  limitData,
  isError,
}: Readonly<TransferLimitsModalProps>) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const handleOnEditLimit = () => {
    onClose();
    navigate("InternalTransfers.TransferSettingScreen");
  };

  const bannerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    padding: theme.spacing["20p"],
  }));

  const currency = t("InternalTransfers.TransferLimitsModal.currencyShort");

  return (
    <Modal
      onClose={onClose}
      testID={testID}
      visible={isVisible}
      headerText={t("InternalTransfers.TransferLimitsModal.title")}>
      <Stack direction="vertical" gap="32p" style={styles.limitStyle}>
        <Stack direction="horizontal" style={bannerStyle}>
          <Typography.Text color={isError ? "errorBase" : "neutralBase+30"}>
            {t("InternalTransfers.TransferLimitsModal.minimumAvailableTransfer")}
          </Typography.Text>
          <Typography.Text color={isError ? "errorBase" : "neutralBase+30"} weight="bold">
            {formatCurrency(getMinimumTransferLimit(limitData), currency)}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text>{t("InternalTransfers.TransferLimitsModal.localLimit")}</Typography.Text>
          <Typography.Text>{formatCurrency(limitData?.AvailableProductLimit ?? 0, currency)}</Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text>{t("InternalTransfers.TransferLimitsModal.globalLimit")}</Typography.Text>
          <Typography.Text>{formatCurrency(limitData?.AvailableGlobalLimit ?? 0, currency)}</Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text>{t("InternalTransfers.TransferLimitsModal.transactionLimit")}</Typography.Text>
          <Typography.Text>{formatCurrency(limitData?.MaxProductTransactionAmount ?? 0, currency)}</Typography.Text>
        </Stack>
        <Button testID={testID !== undefined ? `${testID}-EditLimitButton` : undefined} onPress={handleOnEditLimit}>
          {t("InternalTransfers.TransferLimitsModal.editLimitButton")}
        </Button>
      </Stack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  limitStyle: {
    alignItems: "stretch",
    width: "100%",
  },
});
