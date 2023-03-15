import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import ContentCopySvg from "./content-copy.svg";
import ContentCopyActiveSvg from "./content-copy-active.svg";
import EndButton from "./EndButton";
import PlusCardUnmaskedSvg from "./plus-card-unmasked.svg";
import SingleUseCardUnmaskedSvg from "./single-use-card-unmasked.svg";
import StandardCardUnmaskedeSvg from "./standard-card-unmasked.svg";

interface UnmaskedBankCardProps {
  cardNumber: string;
  cardType: "standard" | "plus" | "single-use";
  onCopyPress: () => void;
  cardDetails: { endDate: string; securityCode: string };
}

export default function UnmaskedBankCard({ cardNumber, cardType, cardDetails, onCopyPress }: UnmaskedBankCardProps) {
  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: 99,
    ...StyleSheet.absoluteFillObject,
  }));

  const splittedNumber = cardNumber ? cardNumber.split("-") : [];

  return (
    <View style={styles.container}>
      {cardType === "single-use" ? (
        <SingleUseCardUnmaskedSvg />
      ) : cardType === "standard" ? (
        <StandardCardUnmaskedeSvg />
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
              <View>
                <Pressable onPress={onCopyPress}>
                  {({ pressed }) => {
                    return (
                      <>
                        <EndButton icon={pressed ? <ContentCopyActiveSvg /> : <ContentCopySvg />} />
                      </>
                    );
                  }}
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
                {cardDetails?.endDate}
              </Typography.Text>
            </Stack>
          </View>
          <View style={styles.securityCodeContainer}>
            <Stack align="center" direction="horizontal" gap="8p">
              <Typography.Text color="neutralBase-50" weight="regular" size="caption2">
                {t("CardActions.CardDetails.securityCode")}
              </Typography.Text>
              <Typography.Text color="neutralBase-50" weight="medium" size="caption1">
                {cardDetails?.securityCode}
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
    paddingHorizontal: 10,
    width: "60%",
  },
  securityCodeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 16,
  },
});
