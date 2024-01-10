import { useTranslation } from "react-i18next";
import { ImageStyle, Pressable } from "react-native";

import { PersonIcon, PlusIcon } from "@/assets/icons";
import IconButton from "@/components/IconButton";
import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

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

  const handleOnViewAllPress = () => {
    navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
  };

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const renderBeneficiaryIcon = (bankLogoUrl: string) => {
    return bankLogoUrl ? (
      <NetworkImage source={{ uri: bankLogoUrl ?? "" }} style={iconStyle} resizeMode="contain" resizeMethod="scale" />
    ) : (
      <PersonIcon color={iconColor} />
    );
  };

  const iconStyle = useThemeStyles<ImageStyle>(theme => ({
    maxWidth: theme.radii.xlarge,
    aspectRatio: 1,
    flex: 1,
  }));

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

        {beneficiaries?.map((beneficiary, index) => {
          return (
            <IconButton
              key={`key ${index}`}
              changeBackgroundColor={true}
              onPress={() => onPress(beneficiary)}
              icon={renderBeneficiaryIcon(beneficiary.BankLogoUrl)}
              active={true}
              activeLabel={beneficiary.Name}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
