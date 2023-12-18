import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { PlusIcon, RepeatIcon } from "@/assets/icons";
import IconButton from "@/components/IconButton";
import Stack from "@/components/Stack";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import Typography from "@/components/Typography";

export default function FrequentBeneficiaries() {
  const { t } = useTranslation();

  const handleOnAddNewBeneficiaryPress = () => {
    //TODO: handle new beneficiary add
    return;
  };

  //TODO: replace with logic after API
  const noop = () => {
    return;
  };

  return (
    <Stack direction="vertical" align="stretch" gap="12p">
      <Stack direction="horizontal" align="center" justify="space-between">
        <Typography.Text size="title3" weight="medium">
          {t("InternalTransfers.TransfersLandingScreen.FrequentBeneficiaries.title")}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
          {t("InternalTransfers.TransfersLandingScreen.viewAll")}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-around">
        <IconButton
          onPress={handleOnAddNewBeneficiaryPress}
          icon={<PlusIcon />}
          active={true}
          activeLabel={t("InternalTransfers.TransfersLandingScreen.TransferServices.splitBills")}
          testID="InternalTransfers.TransfersLandingScreen:AddBeneficiaryButton"
        />

        {/** TODO: Render frequent beneficiaries */}
        <IconButton
          changeBackgroundColor={true}
          onPress={noop}
          icon={createElement(RepeatIcon, { color: "#3BD88C" })}
          active={true}
          activeLabel="Ahmad Abdul Aziz"
        />

        <IconButton
          changeBackgroundColor={true}
          onPress={noop}
          icon={<SvgIcon uri="" width={25} height={25} />}
          active={true}
          activeLabel="Yusuf Sami"
        />
        <IconButton
          changeBackgroundColor={true}
          onPress={noop}
          icon={<SvgIcon uri="" width={25} height={25} />}
          active={true}
          activeLabel="Yusuf Sami"
        />
      </Stack>
    </Stack>
  );
}
