import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

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
  transferType?: TransferType;
  onBeneficiaryPress: (beneficiary: BeneficiaryType) => void;
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
                <PlaceholderImage style={styles.iconStyle} resizeMode="contain" resizeMethod="scale" />
              )}
            </View>
            <Stack direction="vertical">
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {data.Name}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase">
                {i18n.language === "en" ? data.BankName : data.BankArabicName}
              </Typography.Text>

              <Typography.Text size="footnote" color="neutralBase">
                {data.IBAN}
              </Typography.Text>
            </Stack>
          </Stack>
          <ChevronRightIcon color={iconColor} />
        </Stack>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 100,
  },
});
