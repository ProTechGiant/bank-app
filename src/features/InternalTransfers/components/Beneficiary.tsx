import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, InActiveBeneficiaryIcon } from "@/assets/icons";
import NetworkImage from "@/components/NetworkImage";
import PlaceholderImage from "@/components/PlaceholderImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

import { BeneficiaryType } from "../types";

interface BeneficiaryProps {
  data: BeneficiaryType;
  onDelete: (id: number) => void;
  transferType?: TransferType;
  onBeneficiaryPress: (
    accountName: string,
    accountNumber: string,
    phoneNumber: string | undefined,
    iban: string | undefined,
    bankName: string | undefined,
    beneficiaryId: string | undefined
  ) => void;
  onMenuPress: (beneficiary: BeneficiaryType) => void;
  testID?: string;
}

export default function Beneficiary({ data, onBeneficiaryPress, testID }: BeneficiaryProps) {
  const profileContainer = useThemeStyles<ViewStyle>(
    theme => ({
      padding: theme.spacing["8p"],
      borderRadius: 36,
      borderColor: theme.palette["neutralBase-20"],
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      width: 36,
      height: 36,
    }),
    [data]
  );

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <Stack justify="space-between" align="center" direction="horizontal" gap="12p">
      <Pressable
        onPress={() => {
          onBeneficiaryPress(
            data.Name,
            data.BankAccountNumber,
            data.PhoneNumber,
            data.IBAN,
            data.BankName,
            data.BeneficiaryId
          );
        }}
        testID={testID !== undefined ? `${testID}-ButtonPress` : undefined}>
        <Stack align="center" direction="horizontal" gap="12p">
          <View style={profileContainer}>
            {data.BankLogoUrl !== undefined && data.BankLogoUrl !== "" ? (
              <NetworkImage
                source={{ uri: data.BankLogoUrl }}
                style={styles.iconStyle}
                resizeMode="contain"
                resizeMethod="scale"
              />
            ) : !data.IVRValidated ? (
              <InActiveBeneficiaryIcon />
            ) : (
              <PlaceholderImage style={styles.iconStyle} resizeMode="contain" resizeMethod="scale" />
            )}
          </View>
          <Stack direction="vertical">
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {data.Name}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {data.BankName}
            </Typography.Text>

            <Typography.Text size="footnote" color="neutralBase">
              {data.IBAN}
            </Typography.Text>
          </Stack>
        </Stack>
      </Pressable>
      <Pressable style={styles.menuIconContainer} testID={testID !== undefined ? `${testID}-MorePress` : undefined}>
        <ChevronRightIcon color={iconColor} />
      </Pressable>
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 40,
  },
  menuIconContainer: {
    alignItems: "center",
    height: 20,
    justifyContent: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    width: 20,
  },
});
