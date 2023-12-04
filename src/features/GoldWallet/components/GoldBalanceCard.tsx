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
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import balanceCardImage from "../assets/balance-card-image.png";
import divider from "../assets/Divider.png";
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
    marginBottom: theme.spacing["8p"],
    marginTop: theme.spacing["12p"],
  }));

  const ingotPersentageStyle = useThemeStyles<TextStyle>(() => ({
    [direction]: 20,
    position: "absolute",
    top: 30,
    left: 5,
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
        <SafeAreaView edges={["top"]}>
          <NavHeader
            title={t("GoldWallet.title")}
            variant="white"
            end={<NavHeader.IconEndButton icon={<InfoCircleIcon />} onPress={onInfoIconPress} />}
          />
          <Stack direction="horizontal" justify="space-between" style={currentValueContainerStyle}>
            <Stack direction="vertical" gap="12p">
              <Stack direction="horizontal" gap="12p">
                <Typography.Text color="neutralBase-10" size="footnote">
                  {t("GoldWallet.yourGoldValue")}
                </Typography.Text>
                {profitLoss && (
                  <Typography.Text color="neutralBase-60" size="footnote">
                    {/* TODO will replace actuall data once integrate with api */}
                    {profitLoss} %
                  </Typography.Text>
                )}
              </Stack>
              <Typography.Text color="neutralBase-60" size="title1" weight="bold">
                {balance ? balance : 0}
                <Typography.Text color="neutralBase-10" size="title2" weight="regular">
                  {` ${t("GoldWallet.SAR")}`}
                </Typography.Text>
              </Typography.Text>
              <Stack direction="horizontal" justify="space-between">
                <Stack direction="vertical" gap="12p">
                  <Typography.Text color="neutralBase-60" size="footnote">
                    {t("GoldWallet.originalInvestedValue")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-60" size="title2" weight="bold">
                    {balance}
                    <Typography.Text color="neutralBase-60" size="title2" weight="regular">
                      {` ${t("GoldWallet.SAR")}`}
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="vertical">
              <Stack direction="vertical" gap="12p">
                <Stack direction="horizontal" gap="12p">
                  <Typography.Text color="neutralBase-60" size="footnote">
                    {t("GoldWallet.goldWeight")}
                  </Typography.Text>
                  <Stack direction="vertical">
                    <Typography.Text color="neutralBase-10" size="footnote" weight="bold">
                      {goldWeight}
                      <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
                        {" "}
                        {t("GoldWallet.grams")}
                      </Typography.Text>
                    </Typography.Text>
                    <FullGoldIngot />
                    <Typography.Text
                      color="neutralBase-60"
                      size="footnote"
                      weight="regular"
                      style={ingotPersentageStyle}>
                      {goldWeight ? (goldWeight / 10).toFixed(0) : null} %
                    </Typography.Text>
                    <Typography.Text color="neutralBase-60" size="footnote" style={ingotTextStyle}>
                      1 kg
                    </Typography.Text>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </SafeAreaView>
      </ImageBackground>
      <View style={styles.deviderImageContainer}>
        <Image source={divider} style={styles.deviderImage} />
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  cardBackground: {
    height: "100%",
    width: "100%",
  },
  deviderImage: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  deviderImageContainer: {
    // backgroundColor: "green",
    bottom: 0,
    flex: 1,
    height: 56,
    left: 0,
    position: "absolute",
    width: Dimensions.get("screen").width,
  },
});
