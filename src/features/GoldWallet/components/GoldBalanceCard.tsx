import { useTranslation } from "react-i18next";
import {
  Dimensions,
  I18nManager,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCircleIcon } from "@/assets/icons";
import RectangleImageDivider from "@/assets/rectangle-image-divider.png";
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import balancetranceparentBackground from "../assets/balance-background-image.png";
import balanceCardImage from "../assets/balance-card-image.png";
import FullGoldIngot from "../assets/full-gold-ingot.svg";

interface BalanceCardProps {
  balance?: number;
  goldWeight?: number;
  profitLoss?: number;
  onInfoIconPress: () => void;
}

export default function BalanceCard({ balance, goldWeight, profitLoss, onInfoIconPress }: BalanceCardProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const direction = I18nManager.isRTL ? "right" : "left";
  const balanceCardContainer = useThemeStyles<ViewStyle>(() => ({
    position: "relative",
    height: Platform.OS === "android" ? 300 : 300 + insets.top,
  }));

  const currentValueContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: 0,
    width: "100%",
    marginBottom: theme.spacing["32p"],
  }));

  const ingotPersentageStyle = useThemeStyles<TextStyle>(() => ({
    [direction]: 20,
    position: "absolute",
    top: 35,
    transform: [{ rotateZ: "-33deg" }],
    zIndex: 100000,
  }));

  const ingotTextStyle = useThemeStyles<TextStyle>(() => ({
    bottom: 25,
    [direction]: 80,
    position: "absolute",
  }));

  return (
    <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
      <ImageBackground source={balanceCardImage} style={styles.cardBackground} resizeMode="cover">
        <Image source={balancetranceparentBackground} style={styles.balancetranceparentBackground} resizeMode="cover" />
        <SafeAreaView edges={["top"]}>
          <NavHeader
            title={t("GoldWallet.title")}
            variant="white"
            end={<NavHeader.IconEndButton icon={<InfoCircleIcon />} onPress={onInfoIconPress} />}
          />
          <Stack direction="horizontal" justify="space-between" style={currentValueContainerStyle}>
            <Stack direction="vertical" gap="12p">
              <Stack direction="horizontal" gap="12p">
                <Typography.Text color="neutralBase-60" size="footnote">
                  {t("GoldWallet.yourGoldValue")}
                </Typography.Text>
                {profitLoss && (
                  <Typography.Text color="neutralBase-60" size="footnote">
                    {/* TODO will replace actuall data once integrate with api */}
                    {profitLoss} %
                  </Typography.Text>
                )}
              </Stack>
              <Typography.Text color="secondary_yellowBase-10" size="title1" weight="bold">
                {balance ? formatCurrency(balance, t("GoldWallet.SAR"), 2) : 0}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical">
              <Typography.Text color="neutralBase+30" size="callout" weight="bold" style={ingotPersentageStyle}>
                {goldWeight ? (goldWeight / 10).toFixed(0) : null} %
              </Typography.Text>
              <FullGoldIngot />
              <Typography.Text color="neutralBase-60" size="footnote" style={ingotTextStyle}>
                1 kg
              </Typography.Text>
            </Stack>
          </Stack>
          <Stack direction="horizontal" justify="space-between" style={currentValueContainerStyle}>
            <Stack direction="vertical" gap="12p">
              <Typography.Text color="neutralBase-60" size="footnote">
                {t("GoldWallet.originalInvestedValue")}
              </Typography.Text>
              <Typography.Text color="secondary_yellowBase-10" size="title2" weight="bold">
                {balance}
                <Typography.Text color="secondary_yellowBase-10" size="title2" weight="regular">
                  {t("GoldWallet.SAR")}
                </Typography.Text>
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" gap="12p">
              <Typography.Text color="neutralBase-60" size="footnote">
                {t("GoldWallet.goldWeight")}
              </Typography.Text>
              <Typography.Text color="secondary_yellowBase-10" size="title1" weight="bold">
                {goldWeight}
                <Typography.Text color="secondary_yellowBase-10" size="title2" weight="regular">
                  {" "}
                  {t("GoldWallet.grams")}
                </Typography.Text>
              </Typography.Text>
            </Stack>
          </Stack>
        </SafeAreaView>
      </ImageBackground>
      <View style={styles.deviderImageContainer}>
        <Image source={RectangleImageDivider} style={styles.deviderImage} />
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  balancetranceparentBackground: {
    bottom: 0,
    height: 150,
    left: 0,
    position: "absolute",
    width: "100%",
  },
  cardBackground: {
    height: "100%",
    width: "100%",
  },
  deviderImage: {
    height: "100%",
    width: "100%",
  },
  deviderImageContainer: {
    bottom: 0,
    flex: 1,
    height: 25,
    left: 0,
    position: "absolute",
    width: Dimensions.get("screen").width,
  },
});
