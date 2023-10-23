import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import EyeShowIcon from "@/assets/icons/EyeShowIcon";
import { Stack, Typography } from "@/components";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import { useThemeStyles } from "@/theme";

import {
  AddMoneyIcon,
  AllInCardIcon,
  AppleWalletIcon,
  AppleWalletIconAr,
  FreezeIcon,
  RefundIcon,
} from "../assets/icons";
import EyeHideIcon from "../assets/icons/EyeHideIcon";
import NeraCard from "../assets/NeraCardImg.png";
import NeraCardPlus from "../assets/NeraCardPlus.png";
import Triangle from "../assets/Traingle.png";
import { hideBalance } from "../utils/hideBalance";
import CardAction from "./CardAction";

interface AllInCardPlaceholderProps {
  height?: number | string;
  width: number | string;
  variant: "nera" | "neraPlus";
  style?: StyleProp<ViewStyle>;
}

const ASPECT_RATIOS: Record<AllInCardPlaceholderProps["variant"], number> = {
  nera: 1122 / 709,
  neraPlus: 1122 / 709,
};

export default function AllInCardPlaceholder({ variant, height, width, style }: AllInCardPlaceholderProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const [containerHeight, setContainerHeight] = useState(200);

  const handleOnShowBalance = () => {
    setIsBalanceVisible(visible => !visible);
  };

  const cardOverlayActionsStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    top: theme.spacing["32p"],
    right: theme.spacing["64p"],
  }));

  const cardBalanceStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    top: theme.spacing["48p"],
    start: theme.spacing["64p"],
  }));

  const appleWalletButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const balanceContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <View style={styles.content}>
      <View style={[styles.card, style]}>
        <Image
          resizeMode="contain"
          style={{ aspectRatio: ASPECT_RATIOS[variant], height, width }}
          source={variant === "nera" ? NeraCard : NeraCardPlus}
          onLayout={event => {
            const { height: viewHeight } = event.nativeEvent.layout;
            setContainerHeight(viewHeight);
          }}
        />
      </View>
      <View style={{ marginTop: -containerHeight / 2 }}>
        <Image style={styles.content} source={Triangle} resizeMode="stretch" />
      </View>
      <Stack direction="horizontal" justify="space-around" style={{ marginTop: -containerHeight / 2 }}>
        <CardAction text={t("AllInOneCard.Dashboard.actionAddMoney")} icon={<AddMoneyIcon />} />
        <CardAction text={t("AllInOneCard.Dashboard.actionRefund")} icon={<RefundIcon />} />
        <CardAction text={t("AllInOneCard.Dashboard.actionFreeze")} icon={<FreezeIcon />} />
      </Stack>
      <Stack style={cardOverlayActionsStyle} direction="horizontal" gap="16p">
        <Pressable onPress={handleOnShowBalance}>{isBalanceVisible ? <EyeHideIcon /> : <EyeShowIcon />}</Pressable>
        <AllInCardIcon />
      </Stack>
      <Stack style={cardBalanceStyle} direction="vertical">
        <Text style={styles.balanceLabel}>{t("AllInOneCard.Dashboard.totalBalance")}</Text>
        <Stack direction="horizontal" align="baseline" style={balanceContainerStyle}>
          {/* TODO : need to remove 123.87 when api is available in next build cycle */}
          {isBalanceVisible ? (
            <FormatTransactionAmount
              amount={123.87}
              isPlusSignIncluded={false}
              integerSize="large"
              decimalSize="body"
              color="neutralBase-50"
              isCurrencyIncluded={false}
              currencyColor="primaryBase-40"
            />
          ) : (
            <Typography.Text color="neutralBase-60" size="large" weight="bold">
              {hideBalance(123.87)}
            </Typography.Text>
          )}

          <Text style={styles.currency}>{t("AllInOneCard.Dashboard.sar")}</Text>
        </Stack>
      </Stack>
      <Pressable style={appleWalletButtonStyle}>
        {i18n.language === "ar" ? <AppleWalletIconAr width="100%" /> : <AppleWalletIcon width="100%" />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceLabel: {
    color: "white",
  },
  card: {
    backgroundColor: "#EC5F48",
    flexDirection: "row",
    justifyContent: "center",
  },
  content: {
    width: "100%",
  },
  currency: {
    color: "white",
    fontSize: 22,
    marginStart: 10,
  },
});
