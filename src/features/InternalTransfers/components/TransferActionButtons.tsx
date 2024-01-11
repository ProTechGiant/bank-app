import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { AlRajhiIcon, BankAccountIcon, LightningBoltIcon } from "@/assets/icons";
import IconActionButton from "@/components/IconActionButton";
import Stack from "@/components/Stack";
import { TransferType } from "@/types/InternalTransfer";

interface TransferActionButtonsProps {
  onStartTransfer: (transferType: TransferType) => void;
}

export default function TransferActionButtons({ onStartTransfer }: TransferActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="horizontal" align="center" justify="space-between" gap="12p">
      <IconActionButton
        label={t("InternalTransfers.TransfersLandingScreen.ActionButtons.croToCro")}
        onPress={() => onStartTransfer(TransferType.InternalTransferAction)}
        icon={createElement(LightningBoltIcon, { height: 24, width: 24 })}
        testID="InternalTransfers.TransfersLandingScreen:CroToCroTransferButton"
      />

      <IconActionButton
        onPress={() => onStartTransfer(TransferType.CroatiaToArbTransferAction)}
        icon={<AlRajhiIcon />}
        label={t("InternalTransfers.TransfersLandingScreen.ActionButtons.toARB")}
        testID="InternalTransfers.TransfersLandingScreen:ToARBTransferButton"
      />

      <IconActionButton
        onPress={() => onStartTransfer(TransferType.IpsTransferAction)}
        icon={createElement(BankAccountIcon, { height: 24, width: 24 })}
        label={t("InternalTransfers.TransfersLandingScreen.ActionButtons.localTransfer")}
        testID="InternalTransfers.TransfersLandingScreen:LocalTransferButton"
      />
    </Stack>
  );
}
