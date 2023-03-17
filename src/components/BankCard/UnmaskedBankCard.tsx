import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";
import { CardStatus } from "@/features/CardActions/types";
import { useThemeStyles } from "@/theme";

import ContentCopySvg from "./content-copy.svg";
import ContentCopyActiveSvg from "./content-copy-active.svg";
import EndButton from "./EndButton";
import FreezeCardUnmaskedSvg from "./freeze-card-unmasked.svg";
import PlusCardUnmaskedSvg from "./plus-card-unmasked.svg";
import SingleUseCardUnmaskedSvg from "./single-use-card-unmasked.svg";
import StandardCardUnmaskedSvg from "./standard-card-unmasked.svg";

interface UnmaskedBankCardProps {
  cardNumber: string;
  cardStatus: CardStatus;
  cardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  onCopyPress: () => void;
  cardDetails: { endDate: string; securityCode: string };
  productId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
}

export default function UnmaskedBankCard({
  cardNumber,
  cardStatus,
  cardType,
  cardDetails,
  onCopyPress,
  productId,
}: UnmaskedBankCardProps) {
  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: 99,
    ...StyleSheet.absoluteFillObject,
  }));

  const copyButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["10p"],
  }));

  const splittedNumber = cardNumber ? cardNumber.split("-") : [];

  return (
    <View style={styles.container}>
      {cardType === SINGLE_USE_CARD_TYPE ? (
        <SingleUseCardUnmaskedSvg />
      ) : cardStatus === "freeze" ? (
        <FreezeCardUnmaskedSvg />
      ) : productId === STANDARD_CARD_PRODUCT_ID ? (
        <StandardCardUnmaskedSvg />
      ) : (
        <PlusCardUnmaskedSvg />
      )}
      <View style={[styles.container, contentStyles]}>
        <View style={styles.detailsContainer}>
          <View style={styles.cardNumberContainer}>
            <Stack align="center" direction="horizontal" gap="24p">
              <Stack align="center" direction="vertical" gap="10p">
                {splittedNumber.length > 0
                  ? splittedNumber.map(number => (
                      <Stack direction="horizontal" key={Math.random()} gap="5p">
                        {number.split("").map((currentNumber, index) => (
                          <Typography.Text key={index} color="neutralBase-50" weight="medium" size="body">
                            {currentNumber}
                          </Typography.Text>
                        ))}
                      </Stack>
                    ))
                  : null}
              </Stack>
              <View style={copyButtonContainer}>
                <Pressable onPress={onCopyPress}>
                  {({ pressed }) => <EndButton icon={pressed ? <ContentCopyActiveSvg /> : <ContentCopySvg />} />}
                </Pressable>
              </View>
            </Stack>
          </View>
          <View style={styles.dateContainer}>
            <Stack align="center" direction="horizontal" gap="24p">
              <Typography.Text color="neutralBase-50" weight="regular" size="caption2">
                {t("CardActions.CardDetails.validThru")}
              </Typography.Text>
              <Typography.Text color="neutralBase-50" weight="medium" size="caption1">
                {cardDetails.endDate}
              </Typography.Text>
            </Stack>
          </View>
          <View style={styles.securityCodeContainer}>
            <Stack align="center" direction="horizontal" gap="8p">
              <Typography.Text color="neutralBase-50" weight="regular" size="caption2">
                {t("CardActions.CardDetails.securityCode")}
              </Typography.Text>
              <Typography.Text color="neutralBase-50" weight="medium" size="caption1">
                {cardDetails.securityCode}
              </Typography.Text>
            </Stack>
          </View>
        </View>
      </View>
    </View>
  );
}
const CONTAINER_HEIGHT = 338;
const CONTAINER_WIDTH = 224;

const styles = StyleSheet.create({
  cardNumberContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  container: {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 25,
  },
  detailsContainer: {
    justifyContent: "center",
    marginTop: 90,
    paddingHorizontal: 24,
    width: "60%",
  },
  securityCodeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 16,
  },
});
