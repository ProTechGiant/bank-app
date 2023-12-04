import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import { AppleWalletIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AddToAppleWalletButtonProps {
  onPress: () => void;
  testID?: string;
}

export default function AddToAppleWalletButton({ onPress, testID }: AddToAppleWalletButtonProps) {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["16p"],
    alignItems: "center",
    backgroundColor: "#030311",
    borderRadius: theme.radii.regular,
    columnGap: theme.spacing["12p"],
    flexDirection: "row",
    justifyContent: "center",
  }));
  return (
    <Pressable onPress={onPress} style={container} testID={testID}>
      <AppleWalletIcon height={28} width={37} />
      <Typography.Text color="neutralBase-60" size="body" weight="regular">
        {t("AddToAppleWalletButton.label")}
      </Typography.Text>
    </Pressable>
  );
}
