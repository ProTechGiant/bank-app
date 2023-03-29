import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

import { AppleWalletIcon } from "@/assets/icons";
import Typography from "@/components/Typography";

interface AddToAppleWalletButtonProps {
  onPress: () => void;
}

export default function AddToAppleWalletButton({ onPress }: AddToAppleWalletButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <AppleWalletIcon height={28} width={37} />
      <Typography.Text color="neutralBase-60" size="body" weight="regular">
        {t("ApplyCards.AddToAppleWalletScreen.buttons.addToWallet")}
      </Typography.Text>
    </Pressable>
  );
}

// note: this button **intentionally** uses values NOT defined in the theme
// since the Add to Wallet button should be branded according to Apple's guidelines, not ours
// which is why we will probably replace it with the one from the Meawallet SDK
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    borderRadius: 12,
    columnGap: 12,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
