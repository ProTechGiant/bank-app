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

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import { DiamondIcon, EditIcon } from "@/assets/icons";
import { ProgressIndicator, Typography } from "@/components";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import NeraPlus from "../assets/images/neraCard.png";
import NeraPlusCard from "../assets/images/neraPlusCard.png";
import {
  ERROR_CODE_OTP_LIMIT_REACHED,
  ERROR_INSUFFICIENT_BALANCE,
  FREE_WALLET_LIMIT_FOR_NERA,
  FREE_WALLET_LIMIT_FOR_NERA_PLUS,
  VAT_PERCENTAGE,
} from "../constants";
import { useAllInOneCardContext } from "../contexts/AllInOneCardContext";
import { useGetAllPartners, useGetFees, useIssueCard } from "../hooks/query-hooks";
import { CardIssuanceParams, CardTypes } from "../types";
import { BoxContainer, FormattedPrice } from "./../components";

export default function CardReviewScreen() {
  const { t } = useTranslation();
  const addToast = useToasts();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const { userId } = useAuthContext();
  const {
    cardType,
    redemptionMethod,
    paymentPlan,
    paymentPlanId,
    redemptionMethodId,
    paymentPlanCode,
    productCode,
    productId,
  } = useAllInOneCardContext();
  const { data: fees, isLoading: feesIsLoading } = useGetFees(productId, paymentPlanId || "");
  const { data: partnersBenefits, isLoading: partnersBenefitsIsLoading } = useGetAllPartners();
  const { mutateAsync: sendIssueCard, isLoading } = useIssueCard();
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const isNeraPlus = cardType === CardTypes.NERA_PLUS;
  const totalFreeCurrencies = isNeraPlus ? FREE_WALLET_LIMIT_FOR_NERA_PLUS : FREE_WALLET_LIMIT_FOR_NERA;

  const totalStepProgressIndicator = isNeraPlus ? 3 : 2;
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth - 88;

  const aspectRatio = 192 / 302;
  const imageHeight = imageWidth * aspectRatio;

  const isMonthly = paymentPlan === "monthly";

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
  const onConfirm = async () => {
    try {
      const updatedIssue: CardIssuanceParams = {
        CardHolderName: "CardHolderName",
        CardType: "DEBIT",
        CardHolderTitle: "CardHolderTitle",
        VirtualCardIndicator: "V",
        Currency: "Sar",
        ExpiryDate: "2023-12-03T22:27:09",
        WalletList: "WalletList",
        CardProductCode: productCode,
        CustomerId: userId ?? "",
        PaymentPlanCode: paymentPlanCode,
        RedeemptionMethodId: redemptionMethodId,
        FeesAmount: fees?.FeesAmount,
        VatAmount: fees?.VatAmount,
        TotalAmount: fees?.TotalAmount,
      };
      const { OtpId } = await sendIssueCard(updatedIssue);

      otpFlow.handle({
        action: {
          to: "AllInOneCard.CardReview",
        },
        otpVerifyMethod: "aio-card/issuance/otp-validation",
        // TODO: Add otpOptionalParams when api finished from BE team

        otpChallengeParams: {
          OtpId: OtpId,
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
      const code = (error as ApiError<ResponseError>)?.errorContent?.Errors[0].ErrorId;
      const errorCode = JSON.parse(JSON.stringify(error)).errorContent.Errors[0].ErrorCode;
      if (errorCode === ERROR_INSUFFICIENT_BALANCE) {
        setAddFundsModalVisible(true);
      } else if (code === ERROR_CODE_OTP_LIMIT_REACHED) {
        addToast({
          variant: "negative",
          message: t("errors.generic.otpLimitReached"),
        });
      } else warn("All In One Card", "error subscribing to All In One Card", JSON.stringify(error));
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
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.CardReviewScreen:Page">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={totalStepProgressIndicator} totalStep={totalStepProgressIndicator} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => setIsWarningModalVisible(true)} />}
        testID="AllInOneCard.CardReviewScreen:NavHeader"
      />
      {feesIsLoading || partnersBenefitsIsLoading ? (
        <FullScreenLoader />
      ) : (
        <View style={containerViewStyle}>
          <ScrollView>
            <View style={scrollViewStyle}>
              <Typography.Text size="title1" color="neutralBase+30" weight="bold">
                {t("AllInOneCard.CardReviewScreen.orderSummary")}
              </Typography.Text>
              <View style={imageViewStyle}>
                <Image
                  source={isNeraPlus ? NeraPlusCard : NeraPlus}
                  style={{ width: imageWidth, height: imageHeight }}
                />
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
                  {t("AllInOneCard.CardReviewScreen.upTO")}
                  <Typography.Text size="callout" color="complimentBase" weight="bold">
                    {t("AllInOneCard.CardReviewScreen.freeCurrencies", { noOfCurrencies: totalFreeCurrencies })}
                  </Typography.Text>
                  {t("AllInOneCard.CardReviewScreen.currenciesSmall")}
                </Typography.Text>
                <Typography.Text size="footnote" color="neutralBase+10">
                  {t("AllInOneCard.CardReviewScreen.freeCurrenciesDescription")}
                </Typography.Text>
              </BoxContainer>
              {isNeraPlus ? (
                <BoxContainer title={t("AllInOneCard.CardReviewScreen.benefits")}>
                  <View style={styles.verticalGapItem}>
                    <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                      {t("AllInOneCard.CardReviewScreen.freeSubscription")}
                    </Typography.Text>
                    <Typography.Text size="footnote" color="neutralBase+10">
                      {t("AllInOneCard.CardReviewScreen.freeSubscriptionDescription")}
                    </Typography.Text>
                  </View>
                  <View style={freeBenefitsViewStyle}>
                    {partnersBenefits?.PartnersList.map(item => (
                      <SvgIcon uri={item.PartnerLogo} width={24} height={24} />
                    ))}
                  </View>
                </BoxContainer>
              ) : null}

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
                          12
                        </Typography.Text>
                        <Typography.Text size="caption1"> {t("AllInOneCard.CardReviewScreen.months")}</Typography.Text>
                      </View>
                    ) : (
                      <FormattedPrice
                        price={fees ? fees.FeesAmount : ""}
                        currency={t("AllInOneCard.CardReviewScreen.SAR")}
                      />
                    )
                  ) : null}
                </View>
                {isNeraPlus && isMonthly ? (
                  <View style={styles.boxContent}>
                    <Typography.Text size="footnote" color="neutralBase-10">
                      {t("AllInOneCard.CardReviewScreen.monthlyCharges")}
                    </Typography.Text>
                    <FormattedPrice
                      price={fees ? fees.FeesAmount : ""}
                      currency={t("AllInOneCard.CardReviewScreen.SAR")}
                    />
                  </View>
                ) : null}

                {isNeraPlus ? (
                  <View style={styles.boxContent}>
                    <Typography.Text size="footnote" color="neutralBase-10">
                      {t("AllInOneCard.CardReviewScreen.vat", { vatPercentage: VAT_PERCENTAGE })}
                    </Typography.Text>

                    <FormattedPrice
                      price={fees ? fees.VatAmount : ""}
                      currency={t("AllInOneCard.CardReviewScreen.SAR")}
                    />
                  </View>
                ) : null}
                <View style={styles.boxContent}>
                  <Typography.Text size="callout" color="neutralBase+20" weight="bold">
                    {t("AllInOneCard.CardReviewScreen.total")}
                  </Typography.Text>
                  {isNeraPlus ? (
                    <FormattedPrice
                      price={fees ? fees.TotalAmount : ""}
                      currency={t("AllInOneCard.CardReviewScreen.SAR")}
                    />
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
                  }}
                  testID="AllInOneCard.CardReviewScreen:Pressable">
                  <Typography.Text size="footnote" color="complimentBase" style={termsAndConditionsTextStyle}>
                    {t("AllInOneCard.CardReviewScreen.termsAndConditions")}
                  </Typography.Text>
                </Pressable>

                <Typography.Text size="footnote"> {t("AllInOneCard.CardReviewScreen.ofCroatia")}</Typography.Text>
              </View>
            </View>
          </ScrollView>
          <Button onPress={onConfirm} disabled={!hasAgreedToTerms} loading={isLoading}>
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
            testID="AllInOneCard.CardReviewScreen:WarningModal"
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
            testID="AllInOneCard.CardReviewScreen:fundsModal"
          />
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  boxContent: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
