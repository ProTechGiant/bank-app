import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NotificationModal from "@/components/NotificationModal";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  AddMoneyIcon,
  AppleWalletIcon,
  AppleWalletIconAr,
  DarkCreditIcon,
  DarkEyeCloseIcon,
  DarkEyeShowIcon,
  FreezeCardIcon,
  FreezeIcon,
  RefundIcon,
  TopSlantBorder,
} from "../assets/icons";
import FrozenCard from "../assets/images/FrozenCard.png";
import { FREEZE, UNFREEZE } from "../constants";
import { AIOtype } from "../constants";
import { useFreezeCard } from "../hooks/query-hooks";
import { CardInformation } from "../types";
import { hideBalance } from "../utils/hideBalance";
import ActivateCard from "./ActivateCard";
import CardAction from "./CardAction";

interface AllInCardPlaceholderProps {
  cardHeight?: number | string;
  cardWidth: number | string;
  variant: "nera" | "neraPlus";
  style?: StyleProp<ViewStyle>;
  visaCardData?: CardInformation;
}

const ASPECT_RATIOS: Record<AllInCardPlaceholderProps["variant"], number> = {
  nera: 1122 / 709,
  neraPlus: 1122 / 709,
};

export default function AllInCardPlaceholder({
  variant,
  cardHeight,
  cardWidth,
  style,
  visaCardData,
}: AllInCardPlaceholderProps) {
  const navigation = useNavigation();
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const [containerHeight, setContainerHeight] = useState(200);
  const [isFreezeModalVisible, setIsFreezeModalVisible] = useState<boolean>(false);
  const [isFreezeSuccessModal, setIsFreezeSuccessModal] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isDefrostModalVisible, setIsDefrostModalVisible] = useState<boolean>(false);
  const [isDefrostSuccessModal, setIsDefrostSuccessModal] = useState<boolean>(false);

  //TODO: Change later
  const freezeCardValues = {
    CardIdType: "1",
    CardId: "1561d940-49e7-4a38-8b7f-fc41adc0e09a",
    Status: "M",
  };
  const defrostCardValues = {
    CardIdType: "1",
    CardId: "1561d940-49e7-4a38-8b7f-fc41adc0e09a",
    Status: "_",
  };

  const { mutateAsync: freezeCardAsync, isLoading: freezeLoading } = useFreezeCard();

  const [isError, setIsError] = useState<boolean>(false);
  //Delete when API ready
  const isNeraType = variant === AIOtype.Nera.valueOf();

  const handleOnShowBalance = () => {
    setIsBalanceVisible(visible => !visible);
  };
  const handleOnCardControl = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.CardPinScreen",
    });
  };
  const handlerOnCardPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.CardControlScreen",
    });
  };

  const handleFreezeCard = async (Status: string) => {
    if (Status === FREEZE) {
      try {
        await freezeCardAsync(freezeCardValues);
        setIsFreezeModalVisible(false);
        setIsFreezeSuccessModal(true);
        setIsFrozen(true);
      } catch (error) {
        setIsError(true);
        setIsFreezeModalVisible(false);
        warn("freeze card failed", JSON.stringify(error));
      }
    }

    if (Status === UNFREEZE) {
      try {
        await freezeCardAsync(defrostCardValues);
        setIsDefrostModalVisible(false);
        setIsDefrostSuccessModal(true);
        setIsFrozen(false);
      } catch (error) {
        setIsDefrostModalVisible(false);
        setIsError(true);
        warn("Defrost card failed", JSON.stringify(error));
      }
    }
  };

  const handleFreezeCardPress = () => {
    isFrozen ? setIsDefrostModalVisible(true) : setIsFreezeModalVisible(true);
  };
  const handleCloseFreezeModal = () => setIsFreezeModalVisible(false);
  const closeFreezeSuccessModal = () => setIsFreezeSuccessModal(false);
  const handleCloseDefrostModal = () => setIsDefrostModalVisible(false);
  const closeDefrostSuccessModal = () => setIsDefrostSuccessModal(false);

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

  const unFrozenIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  const whiteBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const cardViewStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "relative",
    width: cardWidth,
    height: cardHeight,
    aspectRatio: ASPECT_RATIOS[variant],
    borderRadius: theme.spacing["16p"],
    backgroundColor: isNeraType ? "#FF523D" : "#2C2636",
    marginTop: theme.spacing["16p"],
  }));

  const slopeViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: -theme.spacing["4p"],
    paddingTop: theme.spacing["12p"],
  }));

  const totalBalance = visaCardData?.Balances.find(item => item.Type === "TOTAL_BALANCE")?.Amount ?? 0;

  return (
    <View style={styles.content}>
      <View style={[styles.card, style]}>
        {isFrozen ? (
          <View>
            <Image resizeMode="contain" style={styles.frozenCardImage} source={FrozenCard} />
            <View style={styles.frozenCardButton}>
              <ActivateCard
                label={t("AllInOneCard.Dashboard.cardFrozenButton")}
                icon={<FreezeCardIcon />}
                backgroundColor="neutralBase-60"
                color="interactionBase"
              />
            </View>
          </View>
        ) : (
          <Pressable style={[styles.card, style]} onPress={handlerOnCardPress}>
            <View
              style={cardViewStyle}
              onLayout={event => {
                const { height: viewHeight } = event.nativeEvent.layout;
                setContainerHeight(viewHeight);
              }}
            />
          </Pressable>
        )}
      </View>
      <View style={{ marginTop: -containerHeight / 2 }}>
        <View style={styles.hightTriangle}>
          <TopSlantBorder />
        </View>
      </View>
      <Stack
        direction="horizontal"
        justify="space-around"
        style={[{ backgroundColor: whiteBackgroundColor }, slopeViewStyle]}>
        <CardAction
          text={t("AllInOneCard.Dashboard.actionAddMoney")}
          icon={<AddMoneyIcon color={isFrozen ? "#a2a0a5" : unFrozenIconColor} />}
        />
        <CardAction
          text={t("AllInOneCard.Dashboard.actionRefund")}
          icon={<RefundIcon color={isFrozen ? "#a2a0a5" : unFrozenIconColor} />}
        />
        <CardAction
          text={isFrozen ? t("AllInOneCard.Dashboard.actionDefrost") : t("AllInOneCard.Dashboard.actionFreeze")}
          icon={<FreezeIcon />}
          onPress={handleFreezeCardPress}
        />
      </Stack>
      {!isFrozen ? (
        <>
          <Stack style={cardOverlayActionsStyle} direction="horizontal" gap="16p">
            <Pressable style={styles.backgroundIcon} onPress={handleOnShowBalance}>
              {isBalanceVisible ? <DarkEyeCloseIcon /> : <DarkEyeShowIcon />}
            </Pressable>
            <Pressable style={styles.backgroundIcon} onPress={handleOnCardControl}>
              <DarkCreditIcon />
            </Pressable>
          </Stack>
          <Stack style={cardBalanceStyle} direction="vertical">
            <Text style={styles.balanceLabel}>{t("AllInOneCard.Dashboard.totalBalance")}</Text>
            <Stack direction="horizontal" align="baseline" style={balanceContainerStyle}>
              {/* TODO : need to remove 123.87 when api is available in next build cycle  */}
              {isBalanceVisible ? (
                <FormatTransactionAmount
                  amount={Number(totalBalance)}
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
        </>
      ) : (
        <></>
      )}
      <Pressable style={appleWalletButtonStyle}>
        {i18n.language === "ar" ? <AppleWalletIconAr width="100%" /> : <AppleWalletIcon width="100%" />}
      </Pressable>
      <NotificationModal
        variant="warning"
        title={t("AllInOneCard.Dashboard.FreezeCardModal.title")}
        message={t("AllInOneCard.Dashboard.FreezeCardModal.subtitle")}
        isVisible={isFreezeModalVisible}
        buttons={{
          primary: (
            <Button loading={freezeLoading} onPress={() => handleFreezeCard(FREEZE)}>
              {t("AllInOneCard.Dashboard.FreezeCardModal.freezeButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleCloseFreezeModal}>
              {t("AllInOneCard.Dashboard.FreezeCardModal.noFreezeButton")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="success"
        onClose={closeFreezeSuccessModal}
        title={t("AllInOneCard.Dashboard.FreezeCardModal.freezeModal.title")}
        message={t("AllInOneCard.Dashboard.FreezeCardModal.freezeModal.message")}
        isVisible={isFreezeSuccessModal}
        buttons={{
          primary: (
            <Button onPress={closeFreezeSuccessModal}>
              {t("AllInOneCard.Dashboard.FreezeCardModal.freezeModal.button")}
            </Button>
          ),
        }}
      />

      <NotificationModal
        variant="warning"
        title={t("AllInOneCard.Dashboard.DefrostCardModal.title")}
        message={t("AllInOneCard.Dashboard.DefrostCardModal.subtitle")}
        isVisible={isDefrostModalVisible}
        buttons={{
          primary: (
            <Button loading={freezeLoading} onPress={() => handleFreezeCard(UNFREEZE)}>
              {t("AllInOneCard.Dashboard.DefrostCardModal.defrostButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleCloseDefrostModal}>{t("AllInOneCard.Dashboard.DefrostCardModal.noButton")}</Button>
          ),
        }}
      />
      <NotificationModal
        variant="success"
        onClose={closeDefrostSuccessModal}
        title={t("AllInOneCard.Dashboard.DefrostCardModal.defrostModal.title")}
        isVisible={isDefrostSuccessModal}
        buttons={{
          primary: (
            <Button onPress={closeDefrostSuccessModal}>
              {t("AllInOneCard.Dashboard.DefrostCardModal.defrostModal.button")}
            </Button>
          ),
        }}
      />
      <LoadingErrorNotification
        isVisible={isError}
        onClose={() => setIsError(false)}
        onRefresh={() => handleFreezeCard(isFrozen ? UNFREEZE : FREEZE)}
      />
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
  balanceLabel: {
    color: "white",
  },
  card: {
    backgroundColor: "#1E1A25",
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
  frozenCardButton: {
    left: "25%",
    position: "absolute",
    top: "18%",
  },
  frozenCardImage: {
    marginBottom: 90,
  },
  hightTriangle: {
    height: 33,
  },
});
