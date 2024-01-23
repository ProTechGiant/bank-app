import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, InActiveBeneficiaryIcon, PersonIcon } from "@/assets/icons";
import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

import { BeneficiaryType } from "../types";

interface BeneficiaryProps {
  data: BeneficiaryType;
  transferType?: TransferType;
  onBeneficiaryPress: (beneficiary: BeneficiaryType) => void;
  testID?: string;
}

export default function Beneficiary({ data, onBeneficiaryPress, testID }: BeneficiaryProps) {
  const profileContainer = useThemeStyles<ViewStyle>(
    theme => ({
      padding: theme.spacing["8p"],
      borderRadius: 36,
      borderColor: theme.palette["neutralBase-30"],
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      width: 36,
      height: 36,
    }),
    [data]
  );

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);
  const { i18n } = useTranslation();

  return (
    <View>
      <Pressable
        onPress={() => {
          onBeneficiaryPress(data);
        }}
        testID={testID !== undefined ? `${testID}-ButtonPress` : undefined}>
        <Stack justify="space-between" align="center" direction="horizontal" gap="12p">
          <Stack align="center" direction="horizontal" gap="12p">
            <View style={profileContainer}>
              {data.BankLogoUrl !== undefined && data.BankLogoUrl !== "" ? (
                <NetworkImage
                  source={{ uri: data.BankLogoUrl }}
                  style={styles.iconStyle}
                  resizeMode="cover"
                  resizeMethod="resize"
                />
              ) : !data.IVRValidated ? (
                <InActiveBeneficiaryIcon />
              ) : (
                <PersonIcon color={iconColor} />
              )}
            </View>
            <Stack direction="vertical" flex={1}>
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {data?.Nickname ? data?.Nickname : data?.Name}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase">
                {i18n.language === "en" ? data.BankName : data.BankArabicName}
              </Typography.Text>

              <Typography.Text size="footnote" color="neutralBase">
                {data.IBAN}
              </Typography.Text>
            </Stack>
            <View style={styles.iconContainer}>
              <ChevronRightIcon color={iconColor} />
            </View>
          </Stack>
        </Stack>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  iconStyle: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 100,
  },
});
