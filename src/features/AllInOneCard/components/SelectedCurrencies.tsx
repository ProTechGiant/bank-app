import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeStyles } from "@/theme";

import { MoreHorizontalIcon } from "../assets/icons";
import { FREE_WALLET_LIMIT_FOR_NERA, FREE_WALLET_LIMIT_FOR_NERA_PLUS } from "../constants";
import { CardTypes, CurrenciesType } from "../types";

interface SelectedCurrenciesProps {
  setModalIsVisible: (isVisible: boolean) => void;
  selectedCurrencies: CurrenciesType[];
  myCurrencies: CurrenciesType[];
}

export default function SelectedCurrencies({
  setModalIsVisible,
  selectedCurrencies,
  myCurrencies,
}: SelectedCurrenciesProps) {
  const { t } = useTranslation();
  const { allInOneCardType } = useAuthContext();
  const freeWalletLimit =
    allInOneCardType === CardTypes.NERA ? FREE_WALLET_LIMIT_FOR_NERA : FREE_WALLET_LIMIT_FOR_NERA_PLUS;
  const totalCurrencies = myCurrencies.length + selectedCurrencies.length;
  let paidCurrencies = 0;
  if (totalCurrencies > freeWalletLimit) {
    if (myCurrencies.length > freeWalletLimit) {
      paidCurrencies = selectedCurrencies.length;
    } else {
      paidCurrencies = totalCurrencies - freeWalletLimit;
    }
  }
  const actualCurrenciesFees = (selectedCurrencies.length * 15).toFixed(2);
  const currenciesFeesAfterDiscount = (paidCurrencies * 15).toFixed(2);
  const hasAlreadyEndedFreeWallet = actualCurrenciesFees === currenciesFeesAfterDiscount;
  const vat = (+currenciesFeesAfterDiscount * 0.15).toFixed(2);
  const totalFees = +currenciesFeesAfterDiscount + +vat;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    // padding: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: "#D4D4DE",
    borderRadius: 12,
  }));

  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
    color: "#1E1A25",
  }));

  const optionTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.footnote,
    color: "#423D4A",
    lineHeight: 18,
  }));
  const totalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderTopWidth: 1,
    borderTopColor: "#D4D4DE",
  }));

  const insideContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  const imageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 25,
    height: 25,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#FFF",
    marginLeft: -theme.spacing["8p"],
  }));

  return (
    <Stack direction="vertical" style={containerStyle} testID="AllInOneCard.PaymentCurrenciesScreen:CurrenciesModal">
      <Stack direction="vertical" gap="12p" style={insideContainerStyle}>
        <Text style={mainTextStyle}>{t("AllInOneCard.myCurrenciesScreens.selectedCurrencies")}</Text>
        <Stack direction="horizontal" justify="flex-end" style={[styles.option]}>
          {selectedCurrencies.slice(0, 5).map((item, index) => (
            <View style={imageContainerStyle} key={index}>
              <SvgIcon uri={item.CurrencyLogo || ""} width={22} height={22} />
            </View>
          ))}
          {selectedCurrencies.length > 5 ? (
            <Pressable
              onPress={() => setModalIsVisible(true)}
              style={[imageContainerStyle, styles.moreIconContainer]}
              testID="AllInOneCard.PaymentCurrenciesScreen:pressableSelectedCurrencies">
              <MoreHorizontalIcon />
            </Pressable>
          ) : null}
        </Stack>
        <Stack direction="horizontal" justify="space-between" style={styles.option}>
          <Text style={optionTextStyle}>{t("AllInOneCard.myCurrenciesScreens.selectedCurrencies")}</Text>
          <Text style={optionTextStyle}>{selectedCurrencies.length}</Text>
        </Stack>
        {!hasAlreadyEndedFreeWallet ? (
          <Stack direction="horizontal" justify="space-between" style={styles.option}>
            <Text style={optionTextStyle}>{t("AllInOneCard.myCurrenciesScreens.freeCurrencies")}</Text>
            <Text style={[optionTextStyle]}>{freeWalletLimit - myCurrencies.length}</Text>
          </Stack>
        ) : null}

        <Stack direction="horizontal" justify="space-between" style={styles.option}>
          <Text style={optionTextStyle}>{t("AllInOneCard.myCurrenciesScreens.paidCurrencies")}</Text>
          <Text style={optionTextStyle}>{paidCurrencies}</Text>
        </Stack>
        <Stack direction="horizontal" justify="space-between" style={styles.option}>
          <Text style={optionTextStyle}>{t("AllInOneCard.myCurrenciesScreens.currenciesFees")}</Text>
          <Stack direction="vertical">
            {!hasAlreadyEndedFreeWallet ? (
              <Text style={[optionTextStyle, styles.strikethrough]}>
                {actualCurrenciesFees}
                {t("AllInOneCard.myCurrenciesScreens.sar")}
              </Text>
            ) : null}
            <Text style={optionTextStyle}>
              {currenciesFeesAfterDiscount} {t("AllInOneCard.myCurrenciesScreens.sar")}
            </Text>
          </Stack>
        </Stack>
        <Stack direction="horizontal" justify="space-between" style={styles.option}>
          <Text style={optionTextStyle}>{t("AllInOneCard.myCurrenciesScreens.vat")}</Text>
          <Text style={optionTextStyle}>
            {vat} {t("AllInOneCard.myCurrenciesScreens.sar")}
          </Text>
        </Stack>
      </Stack>
      <Stack direction="horizontal" justify="space-between" style={[styles.option, totalContainerStyle]}>
        <Text style={mainTextStyle}>{t("AllInOneCard.myCurrenciesScreens.total")}</Text>
        <Text style={mainTextStyle}>
          {totalFees} {t("AllInOneCard.myCurrenciesScreens.sar")}
        </Text>
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  moreIconContainer: {
    alignItems: "center",
    backgroundColor: "#ACABBA",
    justifyContent: "center",
  },
  option: {
    width: "100%",
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
});
