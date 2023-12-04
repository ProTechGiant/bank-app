import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";
import { formatCardExpiryDate, formatCardNumber } from "@/features/CardActions/helpers";
import { CardStatus, DetailedCardResponse } from "@/features/CardActions/types";
import { useThemeStyles } from "@/theme";

import ContentCopySvg from "./content-copy.svg";
import FreezeCardUnmaskedSvg from "./freeze-card-unmasked.svg";
import Logo from "./logo.svg";
import PlusCardUnmaskedSvg from "./plus-card-unmasked.svg";
import SingleUseCardUnmaskedSvg from "./single-use-card-unmasked.svg";
import StandardCardUnmaskedSvg from "./standard-card-unmasked.svg";

interface UnmaskedBankCardProps {
  cardStatus: CardStatus;
  cardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  onCopyPress: (value: string) => void;
  cardDetails: DetailedCardResponse;
  productId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
  testID?: string;
}

export default function UnmaskedBankCard({
  cardStatus,
  cardType,
  cardDetails,
  onCopyPress,
  productId,
  testID,
}: UnmaskedBankCardProps) {
  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    padding: theme.spacing["20p"],
    overflow: "hidden",
    ...StyleSheet.absoluteFillObject,
  }));

  const securityCodeContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["32p"],
    gap: theme.spacing["64p"],
  }));

  const detailsContainer = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["20p"],
    left: I18nManager.isRTL ? undefined : theme.spacing["20p"],
    right: I18nManager.isRTL ? theme.spacing["20p"] : undefined,
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    columnGap: theme.spacing["12p"],
    alignItems: "center",
  }));

  return (
    <View style={styles.container} testID={testID}>
      {cardType === SINGLE_USE_CARD_TYPE ? (
        <SingleUseCardUnmaskedSvg />
      ) : cardStatus === "LOCK" ? (
        <FreezeCardUnmaskedSvg />
      ) : productId === STANDARD_CARD_PRODUCT_ID ? (
        <StandardCardUnmaskedSvg />
      ) : (
        <PlusCardUnmaskedSvg />
      )}
      <View style={[contentStyles]}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <View style={detailsContainer}>
          <View style={styles.cardNumberContainer}>
            <Stack align={I18nManager.isRTL ? "flex-end" : "flex-start"} direction="vertical">
              <Typography.Text color="complimentBase-30" weight="regular" size="caption1">
                {t("CardActions.CardDetails.cardNumber")}
              </Typography.Text>
              <View style={iconContainer}>
                <Typography.Text color="neutralBase-50" weight="medium" size="footnote">
                  {formatCardNumber(cardDetails.CardNumber)}
                </Typography.Text>
                <ContentCopySvg onPress={() => onCopyPress(cardDetails.CardNumber)} />
              </View>
            </Stack>
          </View>
          <View style={securityCodeContainer}>
            <Stack align={I18nManager.isRTL ? "flex-end" : "flex-start"} direction="vertical">
              <Typography.Text color="complimentBase-30" weight="regular" size="caption1">
                {t("CardActions.CardDetails.validThru")}
              </Typography.Text>
              <Typography.Text color="neutralBase-50" weight="medium" size="footnote">
                {formatCardExpiryDate(cardDetails.ExpDate)}
              </Typography.Text>
            </Stack>

            <Stack align={I18nManager.isRTL ? "flex-end" : "flex-start"} direction="vertical">
              <Typography.Text color="complimentBase-30" weight="regular" size="caption1">
                {t("CardActions.CardDetails.securityCode")}
              </Typography.Text>
              <View style={iconContainer}>
                <Typography.Text color="neutralBase-50" weight="medium" size="footnote">
                  {cardDetails.Cvv}
                </Typography.Text>
                <ContentCopySvg onPress={() => onCopyPress(cardDetails.Cvv)} />
              </View>
            </Stack>
          </View>

          <View style={iconContainer}>
            <Typography.Text color="complimentBase-30" weight="medium" size="footnote">
              {cardDetails.CardholderName}
            </Typography.Text>
            <ContentCopySvg onPress={() => onCopyPress(cardDetails.CardholderName)} />
          </View>
        </View>
      </View>
    </View>
  );
}

const CONTAINER_HEIGHT = 205;
const CONTAINER_WIDTH = 326;

const styles = StyleSheet.create({
  cardNumberContainer: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "flex-start",
  },
  container: {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    width: "120%",
  },
});
