import { useTranslation } from "react-i18next";
import { Dimensions, Image, ImageBackground, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCircleIcon } from "@/assets/icons";
import RectangleImageDivider from "@/assets/rectangle-image-divider.png";
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import balancetranceparentBackground from "../assets/balance-background-image.png";
import balanceCardImage from "../assets/balance-card-image.png";
import EmptyGoldIngot from "../assets/empty-ingot.svg";

interface BalanceCardProps {
  balance?: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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

  return (
    <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
      <ImageBackground source={balanceCardImage} style={styles.cardBackground} resizeMode="cover">
        <Image source={balancetranceparentBackground} style={styles.balancetranceparentBackground} resizeMode="cover" />
        <SafeAreaView edges={["top"]}>
          <NavHeader
            title={t("GoldWallet.title")}
            variant="white"
            end={
              <NavHeader.IconEndButton
                icon={<InfoCircleIcon />}
                onPress={() => {
                  //TODO
                }}
              />
            }
          />
          <Stack direction="horizontal" justify="space-between" style={currentValueContainerStyle}>
            <Stack direction="vertical" gap="12p">
              <Stack direction="horizontal" gap="12p">
                <Typography.Text color="neutralBase-60" size="footnote">
                  {t("GoldWallet.yourGoldValue")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="footnote">
                  {/* TODO will replace actuall data once integrate with api */}
                  00%
                </Typography.Text>
              </Stack>
              <Typography.Text color="secondary_yellowBase-10" size="title1" weight="bold">
                {balance ?? 0} {t("GoldWallet.SAR")}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical">
              <EmptyGoldIngot />
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
                {/* TODO will replace actuall data once integrate with api */}
                50
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
