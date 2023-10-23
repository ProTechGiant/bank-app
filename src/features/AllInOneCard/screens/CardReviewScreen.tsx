import { StackActions } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  I18nManager,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { DiamondIcon, EditIcon } from "@/assets/icons";
import { ProgressIndicator, Typography } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import NeraPlus from "../assets/images/neraCard.png";
import NeraPlusCard from "../assets/images/neraPlusCard.png";
import { VAT_PERCENTAGE } from "../constants";
import { useAllInOneCardContext } from "../contexts/AllInOneCardContext";
import { useAllInOneCardOTP } from "../hooks/query-hooks";
import { cardReview } from "../mocks";
import { BoxContainer, FormattedPrice } from "./../components";

export default function CardReviewScreen() {
  const { t } = useTranslation();
  const addToast = useToasts();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const { mutateAsync: sendAllInOneCardOTP } = useAllInOneCardOTP();
  const { cardType, redemptionMethod, paymentPlan } = useAllInOneCardContext();
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const isNeraPlus = cardType === "neraPlus";

  const totalStepProgressIndicator = isNeraPlus ? 3 : 2;
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  // Get screen width
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth - 88; // 44 padding on both sides

  // Calculate the height based on aspect ratio
  const aspectRatio = 192 / 302; // Original height / original width
  const imageHeight = imageWidth * aspectRatio;

  const isMonthly = paymentPlan === "monthly";
  const subscription = isMonthly ? cardReview.payment.subscription.monthly : cardReview.payment.subscription.yearly;
  const vat = (+subscription.charges * (VAT_PERCENTAGE / 100)).toFixed(2);
  const total = (+subscription.charges + +vat).toFixed(2);

  const handleOnCancel = () => {
    setIsWarningModalVisible(false);
    setAddFundsModalVisible(false);
    navigation.dispatch(StackActions.pop(4));
    navigation.navigate("Home.DashboardScreen");
  };
  const onPressEditIcon = () => {
    navigation.navigate("AllInOneCard.ChooseRedemptionMethod");
  };

  const handleOnAddFundsPress = () => {
    setAddFundsModalVisible(false);
    navigation.navigate("AddMoney.AddMoneyStack", {
      screen: "AddMoney.AddMoneyInfoScreen",
    });
  };
  const onConfirm = () => {
    //TODO : CHECK IF USER HAS ENOUGH BALANCE
    try {
      otpFlow.handle({
        action: {
          to: "AllInOneCard.CardReview",
        },
        otpVerifyMethod: "aio-card/issuance/otp-validation",
        // TODO: Add otpOptionalParams when api finished from BE team
        otpOptionalParams: {},
        onOtpRequest: () => {
          return sendAllInOneCardOTP();
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("AllInOneCard.ActivatedCardScreen");
          }
          if (status === "fail") {
            addToast({
              variant: "warning",
              message: t("AllInOneCard.ActivatedCardScreen.subscriptionFailed"),
            });
          }
        },
      });
    } catch (error) {
      warn("All In One Card", "error subscribing to All In One Card", JSON.stringify(error));
    }
  };

  const freeBenefitsViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: -theme.spacing["4p"],
    marginTop: theme.spacing["12p"],
  }));

  const termsAndConditionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    textDecorationLine: "underline",
    marginLeft: theme.spacing["4p"],
  }));

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing["20p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    gap: theme.spacing["20p"],
  }));

  const imageViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
  }));
  const neraPlusContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center", // this line ensures children are aligned to the start
    justifyContent: "center",
    borderRadius: theme.spacing["8p"],
    backgroundColor: "#3AFDDC33",
    paddingHorizontal: theme.spacing["8p"],
    gap: theme.spacing["4p"],
    width: 114,
    paddingVertical: 2,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={totalStepProgressIndicator} totalStep={totalStepProgressIndicator} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => setIsWarningModalVisible(true)} />}
      />
      <View style={containerViewStyle}>
        <ScrollView>
          <View style={scrollViewStyle}>
            <Typography.Text size="title1" color="neutralBase+30" weight="bold">
              {t("AllInOneCard.CardReviewScreen.orderSummary")}
            </Typography.Text>
            <View style={imageViewStyle}>
              <Image source={isNeraPlus ? NeraPlusCard : NeraPlus} style={{ width: imageWidth, height: imageHeight }} />
            </View>
            <BoxContainer title={t("AllInOneCard.CardReviewScreen.card")}>
              <View style={styles.verticalGapItem}>
                <Typography.Text size="footnote" color="neutralBase+10">
                  {t("AllInOneCard.CardReviewScreen.type")}
                </Typography.Text>
                {isNeraPlus ? (
                  <View style={neraPlusContainerStyle}>
                    <DiamondIcon width={17} height={16} color="#000" />
                    <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                      Nera Plus
                    </Typography.Text>
                  </View>
                ) : (
                  <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                    Nera
                  </Typography.Text>
                )}
              </View>
              <View style={styles.verticalGapItem}>
                <View style={styles.boxContent}>
                  <Typography.Text size="footnote" color="neutralBase+10">
                    {t("AllInOneCard.CardReviewScreen.rewardMethode")}
                  </Typography.Text>
                  <Pressable onPress={onPressEditIcon}>
                    <EditIcon color="#FF371E" width={20} height={20} />
                  </Pressable>
                </View>
                <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                  {redemptionMethod}
                </Typography.Text>
              </View>
            </BoxContainer>

            <BoxContainer title={t("AllInOneCard.CardReviewScreen.currencies")}>
              <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                {cardReview.currencies.freeCurrencies}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase+10">
                {cardReview.currencies.description}
              </Typography.Text>
            </BoxContainer>

            <BoxContainer title={t("AllInOneCard.CardReviewScreen.benefits")}>
              <View style={styles.verticalGapItem}>
                <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                  {t("AllInOneCard.CardReviewScreen.freeSubscription")}
                </Typography.Text>
                <Typography.Text size="footnote" color="neutralBase+10">
                  {cardReview.benefits.note}
                </Typography.Text>
              </View>
              <View style={freeBenefitsViewStyle}>
                {cardReview.benefits.icons.map((item, index) => (
                  <View style={styles.circleContainer} key={index}>
                    {item}
                  </View>
                ))}
              </View>
            </BoxContainer>

            <BoxContainer title={t("AllInOneCard.CardReviewScreen.payment")}>
              <View style={styles.boxContent}>
                <Typography.Text size="footnote" color="neutralBase-10">
                  {isNeraPlus && isMonthly
                    ? t("AllInOneCard.CardReviewScreen.monthlySubscription")
                    : t("AllInOneCard.CardReviewScreen.yearlySubscription")}
                </Typography.Text>

                {isNeraPlus ? (
                  isMonthly ? (
                    <View style={styles.priceLabel}>
                      <Typography.Text size="callout" weight="bold">
                        {subscription?.duration}
                      </Typography.Text>
                      <Typography.Text size="caption1"> {t("AllInOneCard.CardReviewScreen.months")}</Typography.Text>
                    </View>
                  ) : (
                    <FormattedPrice price={subscription.charges} />
                  )
                ) : null}
              </View>
              {isNeraPlus && isMonthly ? (
                <View style={styles.boxContent}>
                  <Typography.Text size="footnote" color="neutralBase-10">
                    {t("AllInOneCard.CardReviewScreen.monthlyCharges")}
                  </Typography.Text>
                  <FormattedPrice price={subscription.charges} />
                </View>
              ) : null}

              {isNeraPlus ? (
                <View style={styles.boxContent}>
                  <Typography.Text size="footnote" color="neutralBase-10">
                    {t("AllInOneCard.CardReviewScreen.vat", { vat: VAT_PERCENTAGE })}
                  </Typography.Text>

                  <FormattedPrice price={vat} />
                </View>
              ) : null}
              <View style={styles.boxContent}>
                <Typography.Text size="callout" color="neutralBase+20" weight="bold">
                  {t("AllInOneCard.CardReviewScreen.total")}
                </Typography.Text>
                {isNeraPlus ? (
                  <FormattedPrice price={total} />
                ) : (
                  <Typography.Text size="callout" color="neutralBase+20">
                    {t("AllInOneCard.CardReviewScreen.freeForLife")}
                  </Typography.Text>
                )}
              </View>
            </BoxContainer>

            <View style={styles.rowLayout}>
              <CheckboxInput
                isEditable={true}
                label={t("AllInOneCard.CardReviewScreen.agree")}
                value={hasAgreedToTerms}
                onChange={() => setHasAgreedToTerms(!hasAgreedToTerms)}
              />

              <Pressable
                onPress={() => {
                  navigation.navigate("AllInOneCard.TermsAndConditions");
                }}>
                <Typography.Text size="footnote" color="successBase" style={termsAndConditionsTextStyle}>
                  {t("AllInOneCard.CardReviewScreen.termsAndConditions")}
                </Typography.Text>
              </Pressable>

              <Typography.Text size="footnote"> {t("AllInOneCard.CardReviewScreen.ofCroatia")}</Typography.Text>
            </View>
          </View>
        </ScrollView>
        <Button onPress={onConfirm} disabled={!hasAgreedToTerms}>
          {t("AllInOneCard.CardReviewScreen.confirm")}
        </Button>
        <NotificationModal
          variant="warning"
          title={t("AllInOneCard.SelectPaymentOptionScreen.warningModal.title")}
          message={t("AllInOneCard.SelectPaymentOptionScreen.warningModal.message")}
          isVisible={isWarningModalVisible}
          onClose={() => setIsWarningModalVisible(false)}
          buttons={{
            primary: (
              <Button onPress={handleOnCancel}>
                {t("AllInOneCard.SelectPaymentOptionScreen.warningModal.CancelButton")}
              </Button>
            ),
          }}
        />
        <NotificationModal
          variant="error"
          title={t("AllInOneCard.CardReviewScreen.title")}
          message={t("AllInOneCard.CardReviewScreen.message")}
          isVisible={addFundsModalVisible}
          onClose={handleOnCancel}
          buttons={{
            primary: (
              <Button onPress={handleOnAddFundsPress}>{t("AllInOneCard.CardReviewScreen.primaryButtonText")}</Button>
            ),
          }}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  boxContent: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  circleContainer: {
    alignItems: "center",
    borderColor: "#D9D9D9",
    borderRadius: 12.5,
    borderWidth: 1,
    height: 25,
    justifyContent: "center",
    overflow: "hidden",
    width: 25,
  },
  priceLabel: {
    alignItems: "baseline",
    flexDirection: "row",
  },

  progressIndicator: { width: "80%" },
  rowLayout: {
    flexDirection: "row",
  },
  verticalGapItem: {
    gap: 4,
  },
});
