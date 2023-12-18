import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { AlRajhiIcon, BankAccountIcon, LightningBoltIcon } from "@/assets/icons";
import IconActionButton from "@/components/IconActionButton";
import Stack from "@/components/Stack";

interface TransferActionButtonsProps {
  onCroToCroPress: () => void;
  onToARBPress: () => void;
  onLocalTransferPress: () => void;
}

export default function TransferActionButtons({
  onCroToCroPress,
  onToARBPress,
  onLocalTransferPress,
}: TransferActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="horizontal" align="center" justify="space-between">
      <IconActionButton
        label={t("InternalTransfers.TransfersLandingScreen.ActionButtons.croToCro")}
        onPress={onCroToCroPress}
        icon={createElement(LightningBoltIcon, { height: 24, width: 24 })}
        testID="InternalTransfers.TransfersLandingScreen:CroToCroTransferButton"
      />

      <IconActionButton
        onPress={onToARBPress}
        icon={<AlRajhiIcon />}
        label={t("InternalTransfers.TransfersLandingScreen.ActionButtons.toARB")}
        testID="InternalTransfers.TransfersLandingScreen:ToARBTransferButton"
      />

      <IconActionButton
        onPress={onLocalTransferPress}
        icon={createElement(BankAccountIcon, { height: 24, width: 24 })}
        label={t("InternalTransfers.TransfersLandingScreen.ActionButtons.localTransfer")}
        testID="InternalTransfers.TransfersLandingScreen:LocalTransferButton"
      />
    </Stack>
  );
}
