import { useTranslation } from "react-i18next";

import { ReceiptIcon, RepeatIcon, SplitIcon } from "@/assets/icons";
import IconButton from "@/components/IconButton";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

export default function TransferServices() {
  const { t } = useTranslation();

  const handleOnSplitBillPress = () => {
    //TODO: feature not implemented yet
  };
  const handleOnStandingOrderPress = () => {
    //TODO: feature not implemented yet
  };

  const handleOnRequestToPayPress = () => {
    //TODO: feature not implemented yet
  };

  return (
    <Stack direction="vertical" align="stretch" gap="12p">
      <Stack direction="horizontal" align="center" justify="space-between">
        <Typography.Text size="title3" weight="medium">
          {t("InternalTransfers.TransfersLandingScreen.TransferServices.title")}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
          {t("InternalTransfers.TransfersLandingScreen.viewAll")}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-around">
        <IconButton
          onPress={handleOnSplitBillPress}
          icon={<SplitIcon />}
          active={true}
          activeLabel={t("InternalTransfers.TransfersLandingScreen.TransferServices.splitBills")}
          testID="InternalTransfers.TransfersLandingScreen:SplitBillsButton"
        />
        <IconButton
          onPress={handleOnStandingOrderPress}
          icon={<RepeatIcon />}
          active={true}
          activeLabel={t("InternalTransfers.TransfersLandingScreen.TransferServices.standingOrders")}
          testID="InternalTransfers.TransfersLandingScreen:StandingOrdersButton"
        />

        <IconButton
          onPress={handleOnRequestToPayPress}
          icon={<ReceiptIcon />}
          active={true}
          activeLabel={t("InternalTransfers.TransfersLandingScreen.TransferServices.requestToPay")}
          testID="InternalTransfers.TransfersLandingScreen:RequestToPayButton"
        />
      </Stack>
    </Stack>
  );
}
