import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { PlusIcon } from "@/assets/icons";
import IconButton from "@/components/IconButton";
import Stack from "@/components/Stack";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import Typography from "@/components/Typography";

import { BeneficiaryType } from "../types";

interface FrequentBeneficiariesProps {
  beneficiaries: BeneficiaryType[];
  onPress: (beneficiary: BeneficiaryType) => void;
  onAddNewBeneficiary: () => void;
}

export default function FrequentBeneficiaries({
  beneficiaries,
  onPress,
  onAddNewBeneficiary,
}: FrequentBeneficiariesProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnAddNewBeneficiaryPress = () => {
    //TODO: handle new beneficiary add
    return;
  };

  const handleOnViewAllPress = () => {
    //TODO: handle new beneficiary add
    navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
  };
  return (
    <Stack direction="vertical" align="stretch" gap="12p">
      <Stack direction="horizontal" align="center" justify="space-between">
        <Typography.Text size="title3" weight="medium">
          {t("InternalTransfers.TransfersLandingScreen.FrequentBeneficiaries.title")}
        </Typography.Text>
        <Pressable onPress={handleOnViewAllPress}>
          <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
            {t("InternalTransfers.TransfersLandingScreen.viewAll")}
          </Typography.Text>
        </Pressable>
      </Stack>
      <Stack direction="horizontal" align="flex-start" justify="space-around">
        <IconButton
          onPress={onAddNewBeneficiary}
          icon={<PlusIcon />}
          active={true}
          activeLabel={t("InternalTransfers.TransfersLandingScreen.FrequentBeneficiaries.addBeneficiary")}
          testID="InternalTransfers.TransfersLandingScreen:AddBeneficiaryButton"
        />

        {beneficiaries.map((beneficiary, index) => {
          return (
            <IconButton
              key={`key ${index}`}
              changeBackgroundColor={true}
              onPress={() => onPress(beneficiary)}
              icon={<SvgIcon uri={beneficiary.BankLogoUrl} width={24} height={24} />}
              active={true}
              activeLabel={beneficiary.Name}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
