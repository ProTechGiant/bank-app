import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ThreeDotsVerticalIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { getInitials } from "@/utils";

import { BeneficiaryType } from "../types";

interface BeneficiaryProps {
  data: BeneficiaryType;
  onDelete: (id: number) => void;
  onBeneficiaryPress: () => void;
  onMenuPress: (beneficiary: BeneficiaryType) => void;
}

export default function Beneficiary({ data, onBeneficiaryPress, onMenuPress }: BeneficiaryProps) {
  const handleOnMenuPress = () => {
    onMenuPress(data);
  };

  const profileContainer = useThemeStyles<ViewStyle>(
    theme => ({
      padding: theme.spacing["8p"],
      backgroundColor: data.isActive ? theme.palette.primaryBase : theme.palette["neutralBase-20"],
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
      width: 36,
      height: 36,
    }),
    [data]
  );

  const iconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <Stack justify="space-between" align="center" direction="horizontal" gap="12p">
      <Pressable onPress={onBeneficiaryPress}>
        <Stack align="center" direction="horizontal" gap="12p">
          <View style={profileContainer}>
            <Typography.Text size="footnote" color="neutralBase-50" align="center">
              {getInitials(data.name)}
            </Typography.Text>
          </View>
          <Stack direction="vertical">
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {data.name}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {data.bank}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              {data.accountNumber}
            </Typography.Text>
          </Stack>
        </Stack>
      </Pressable>
      <Pressable onPress={handleOnMenuPress} style={styles.menuIconContainer}>
        <ThreeDotsVerticalIcon color={iconColor} />
      </Pressable>
    </Stack>
  );
}

const styles = StyleSheet.create({
  menuIconContainer: {
    alignItems: "center",
    height: 20,
    justifyContent: "center",
    width: 20,
  },
});
