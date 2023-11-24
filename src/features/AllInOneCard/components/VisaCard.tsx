import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, I18nManager, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useToasts } from "@/contexts/ToastsContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { DarkCreditIcon, EllipseIcon, NeraIcon, VisaIcon } from "../assets/icons";
import { CardInformation } from "../types";

interface CardDetailsProps {
  visaCardData: CardInformation;
  isNera: boolean;
}

export default function VisaCard({ isNera, visaCardData }: CardDetailsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const addToast = useToasts();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.CardControlScreen">>();
  const pinVerified = route.params?.pinVerified;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [detailsIsVisible, setDetailsIsVisible] = useState<boolean>(false);
  const { AccountNumber, CardExpiryDate, CardHolderName } = visaCardData;
  //TODO: remove this after api integration
  const CVV = "123";

  useFocusEffect(
    useCallback(() => {
      if (pinVerified) {
        setDetailsIsVisible(true);
        setRemainingSeconds(90);
      }
    }, [pinVerified])
  );

  useLayoutEffect(() => {
    if (!detailsIsVisible) {
      return;
    }
    const intervalId = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 0) {
          setDetailsIsVisible(false);
          clearInterval(intervalId);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [detailsIsVisible]);

  const formattedTime = format(new Date(remainingSeconds * 1000), "mm:ss");

  // Get screen width
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = 302;
  const aspectRatio = 192 / imageWidth;
  const imageHeight = imageWidth * aspectRatio;

  const handleOnPress = () => {
    navigation.navigate("AllInOneCard.CardPinScreen");
  };
  const handleOnCopyNumberPress = (text: string) => {
    const isItAccountUserName = text === CardHolderName;
    Clipboard.setString(text);
    addToast({
      variant: "confirm",
      message: isItAccountUserName
        ? t("AllInOneCard.CardControlScreen.AccountUserNameCopied")
        : t("AllInOneCard.CardControlScreen.AccountNumberCopied"),
      position: "top",
    });
  };

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: 44,
    marginVertical: theme.spacing["20p"],
  }));
  const cardViewStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "relative",
    padding: theme.spacing["16p"],
    width: imageWidth,
    height: imageHeight,
    borderRadius: theme.radii.medium,
    backgroundColor: isNera ? "#FF523D" : "#2C2636",
    left: (screenWidth - imageWidth) / 2 - 44,
    justifyContent: "space-between",
  }));
  const timerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "rgba(250, 250, 250, 0.60)",
    borderRadius: theme.spacing["16p"],
    paddingHorizontal: 10,
    paddingVertical: 2,
  }));
  const plusTextStyle = useThemeStyles<TextStyle>(theme => ({
    color: isNera ? "#fff" : "#78758A",
    fontSize: theme.typography.text.sizes.caption1,
    fontWeight: theme.typography.text.weights.regular,
  }));
  const timerTextStyle = useThemeStyles<TextStyle>(theme => ({
    color: "#1E1A25",
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
  }));

  return (
    <View style={containerViewStyle}>
      <Stack direction="vertical" gap="8p" justify="flex-end" style={cardViewStyle}>
        <Stack direction="horizontal" style={[styles.rtl, styles.fullWidth]} justify="space-between">
          <Stack direction="horizontal" justify="space-between" gap="8p" style={[styles.ltr]}>
            <Pressable onPress={handleOnPress} disabled={detailsIsVisible} style={styles.backgroundIcon}>
              <DarkCreditIcon />
            </Pressable>
          </Stack>
          {!detailsIsVisible ? null : (
            <View style={timerViewStyle}>
              <Text style={timerTextStyle}>{formattedTime}</Text>
            </View>
          )}
        </Stack>
        <Stack direction="horizontal" justify="space-between" style={[styles.fullWidth, styles.ltr]}>
          <Stack align="center" direction="horizontal" gap="8p" style={styles.ltr}>
            {detailsIsVisible ? (
              AccountNumber.match(/.{1,4}/g)?.map(group => (
                <Typography.Text size="callout" weight="medium" color="neutralBase-60">
                  {group}
                </Typography.Text>
              ))
            ) : (
              <>
                <Stack direction="horizontal" gap="4p">
                  <EllipseIcon />
                  <EllipseIcon />
                  <EllipseIcon />
                  <EllipseIcon />
                </Stack>
                <Typography.Text size="callout" weight="medium" color="neutralBase-60">
                  {AccountNumber.slice(-4)}
                </Typography.Text>
              </>
            )}
          </Stack>
          {detailsIsVisible ? (
            <Pressable
              style={styles.iconContainer}
              onPress={handleOnCopyNumberPress.bind(null, CardHolderName)}
              testID="Home.DashboardScreen:CopyAccountNumberButton">
              <CopyIcon width={16} height={16} />
            </Pressable>
          ) : null}
        </Stack>
        {detailsIsVisible ? (
          <Stack direction="horizontal" justify="space-between" align="center" style={[styles.fullWidth, styles.ltr]}>
            <Typography.Text size="callout" color="neutralBase-60">
              {CardHolderName}
            </Typography.Text>
            <Pressable
              style={styles.iconContainer}
              onPress={handleOnCopyNumberPress.bind(null, AccountNumber)}
              testID="Home.DashboardScreen:CopyAccountNumberButton">
              <CopyIcon width={16} height={16} />
            </Pressable>
          </Stack>
        ) : null}

        <Stack direction="horizontal" justify="space-between" style={[styles.fullWidth, styles.ltr]}>
          <Stack align="center" direction="horizontal" gap="4p" style={styles.ltr}>
            <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
              EXP:
            </Typography.Text>
            {detailsIsVisible ? (
              <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                {CardExpiryDate.slice(0, 2)}/{CardExpiryDate.slice(2, 4)}
              </Typography.Text>
            ) : (
              <Stack direction="horizontal" gap="4p" align="center">
                <EllipseIcon />
                <EllipseIcon />
                <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                  /
                </Typography.Text>
                <EllipseIcon />
                <EllipseIcon />
              </Stack>
            )}
          </Stack>
          <Stack align="center" direction="horizontal" gap="4p" style={[styles.ltr]}>
            <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
              CVV:
            </Typography.Text>
            {detailsIsVisible ? (
              <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                {CVV}
              </Typography.Text>
            ) : (
              <Stack direction="horizontal" gap="4p">
                <EllipseIcon />
                <EllipseIcon />
                <EllipseIcon />
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack direction="horizontal" justify="space-between" style={[styles.fullWidth, styles.ltr]}>
          <Stack direction="vertical" align={I18nManager.isRTL ? "flex-end" : "flex-start"}>
            <NeraIcon color={isNera ? "#fff" : undefined} />
            {!isNera ? <Text style={plusTextStyle}>Plus</Text> : null}
          </Stack>
          <Stack direction="vertical" align={I18nManager.isRTL ? "flex-start" : "flex-end"}>
            <VisaIcon color={isNera ? "#fff" : undefined} />
            <Text style={plusTextStyle}>Signature</Text>
          </Stack>
        </Stack>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundIcon: {
    alignItems: "center",
    backgroundColor: "rgba(250, 250, 250, 0.60)",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  fullWidth: {
    width: "100%",
  },
  iconContainer: {
    transform: [{ rotate: "180deg" }, { scaleX: -1 }],
  },
  ltr: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
  rtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
});
