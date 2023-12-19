import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import { CheckboxInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { NeraPhysicalCard, NeraPlusPhysicalCard } from "../assets/images";
import { InfoBox } from "../components";
import {
  ACTION_TYPE,
  CARD_ID_TYPE_EXID,
  FEE_TYPE,
  ISSUANCE_REASON_TYPE,
  NO_OF_ITEMS,
  PRODUCT_CODE,
} from "../constants";
import { useFeatureFee, usePhysicalCardIssuance } from "../hooks/query-hooks";
import { numberOfDays } from "../mocks";
import { CardTypes, PhysicalCardIssuanceRequest } from "../types";
import { BoxContainer, FormattedPrice } from "./../components";

export default function SummaryAddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { allInOneCardType, setApplyAioCardStatus, otherAioCardProperties } = useAuthContext();
  const { mutateAsync: mutateAsyncCardIssuance, isLoading: loadingCardIssuance } = usePhysicalCardIssuance();
  const {
    data: dataPhysicalCardFee,
    isLoading: isLoadingFee,
    isError,
    refetch,
  } = useFeatureFee({
    cardId: otherAioCardProperties.aioCardId ?? "",
    productCode: PRODUCT_CODE,
    feesType: FEE_TYPE,
    noOfItems: NO_OF_ITEMS,
  });
  const otpFlow = useOtpFlow();
  const addToast = useToasts();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.SummaryAddressScreen">>();
  const address = route.params?.address;

  const isNeraPlus = allInOneCardType === CardTypes.NERA_PLUS;

  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth - 80;
  const aspectRatio = 192 / 260;
  const imageHeight = imageWidth * aspectRatio;
  const cardSource = isNeraPlus ? NeraPlusPhysicalCard : NeraPhysicalCard;

  const handleEditAddress = () => {
    navigation.navigate("AllInOneCard.SetAddressScreen", { address: address });
  };

  const handleNavigateDashboard = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.Dashboard" });
  };

  const onConfirmOTP = async () => {
    try {
      const issuanceRequest: PhysicalCardIssuanceRequest = {
        CardId: otherAioCardProperties.aioCardId ?? "",
        Fees: dataPhysicalCardFee?.FeesAmount ?? "",
        Vat: dataPhysicalCardFee?.VatAmount ?? "",
        TotalAmount: dataPhysicalCardFee?.TotalAmount ?? "",
        Reason: ISSUANCE_REASON_TYPE,
        ActionType: ACTION_TYPE,
        CardIdType: CARD_ID_TYPE_EXID,
      };
      const { OtpId } = await mutateAsyncCardIssuance(issuanceRequest);

      otpFlow.handle({
        action: {
          to: "AllInOneCard.CardComingSoonScreen",
        },
        otpVerifyMethod: "aio-card/physical-card/otp-validation",
        // TODO: Add otpOptionalParams when api finished from BE team
        otpChallengeParams: {
          OtpId: OtpId,
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("AllInOneCard.CardComingSoonScreen");
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

  const handleConfirmApply = () => {
    isNeraPlus ? onConfirmOTP() : navigation.navigate("AllInOneCard.CardComingSoonScreen");
    setApplyAioCardStatus(true);
  };

  const termsAndConditionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    textDecorationLine: "underline",
    marginLeft: theme.spacing["4p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["20p"],
    flex: 1,
  }));

  const imageViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
  }));

  const editIconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));
  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const editIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.SummaryAddressScreen:Page">
      <NavHeader
        testID="AllInOneCard.SummaryAddressScreen:NavHeader"
        end={<NavHeader.CloseEndButton onPress={handleNavigateDashboard} />}
      />
      {isLoadingFee ? (
        <FullScreenLoader />
      ) : dataPhysicalCardFee !== undefined ? (
        <ContentContainer isScrollView={isNeraPlus}>
          <View style={scrollViewStyle}>
            <Typography.Text size="title1" color="neutralBase+30" weight="bold">
              {t("AllInOneCard.SummaryAddressScreen.title")}
            </Typography.Text>
            <View style={imageViewStyle}>
              <Image source={cardSource} style={{ width: imageWidth, height: imageHeight }} />
            </View>
            <BoxContainer title={t("AllInOneCard.SummaryAddressScreen.delivery")}>
              <Stack direction="vertical" gap="4p" align="stretch">
                {address.IsPrimary ? (
                  <>
                    <Typography.Text size="footnote" color="neutralBase-10">
                      {t("AllInOneCard.SummaryAddressScreen.address")}
                    </Typography.Text>
                    <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                      {t("AllInOneCard.SummaryAddressScreen.defaultAddress")}
                    </Typography.Text>
                  </>
                ) : null}

                <Stack direction="horizontal" justify="space-between">
                  <View>
                    <Typography.Text size="footnote" color="neutralBase-10">
                      {t("AllInOneCard.SummaryAddressScreen.address")}
                    </Typography.Text>

                    <Typography.Text size="callout" color="neutralBase+30">
                      {address.BuildingNumber}
                    </Typography.Text>
                    <Typography.Text size="callout" color="neutralBase+30">
                      {address.StreetName}
                    </Typography.Text>
                    <Typography.Text size="callout" color="neutralBase+30">
                      {address.District}
                    </Typography.Text>
                    <Typography.Text size="callout" color="neutralBase+30">
                      {address.CityCode} {address.Postcode}
                    </Typography.Text>
                    {address.CountryCode ? (
                      <Typography.Text size="callout" color="neutralBase+30">
                        {address.CountryCode}
                      </Typography.Text>
                    ) : null}
                  </View>

                  <Pressable
                    testID="AllInOneCard.SummaryAddressScreen:EditIconPressable"
                    style={editIconStyle}
                    onPress={handleEditAddress}>
                    <EditIcon color={editIconColor} width={20} height={20} />
                  </Pressable>
                </Stack>
              </Stack>
            </BoxContainer>
            {isNeraPlus ? (
              <BoxContainer title={t("AllInOneCard.SummaryAddressScreen.payment")}>
                <Stack direction="horizontal" justify="space-between">
                  <Typography.Text size="footnote" color="neutralBase-10" weight="medium">
                    {t("AllInOneCard.SummaryAddressScreen.feesAndVat")}
                  </Typography.Text>
                  <Typography.Text size="caption1">
                    <Typography.Text size="callout" weight="bold">
                      {Number(dataPhysicalCardFee.FeesAmount) + Number(dataPhysicalCardFee.VatAmount)}{" "}
                    </Typography.Text>
                    {t("AllInOneCard.SummaryAddressScreen.sar")}
                  </Typography.Text>
                </Stack>
                <Stack direction="horizontal" justify="space-between">
                  <Typography.Text size="callout" color="neutralBase+30" weight="semiBold">
                    {t("AllInOneCard.SummaryAddressScreen.totalAmount")}
                  </Typography.Text>
                  <FormattedPrice
                    price={dataPhysicalCardFee.TotalAmount}
                    currency={t("AllInOneCard.SummaryAddressScreen.sar")}
                    currencyColor="neutralBase+30"
                  />
                </Stack>
              </BoxContainer>
            ) : (
              <></>
            )}
            <InfoBox
              description={t("AllInOneCard.SummaryAddressScreen.label", { days: numberOfDays })}
              color="primaryBase-70"
              radius="small"
            />
            <View style={styles.rowLayout}>
              <CheckboxInput
                isEditable={true}
                label={t("AllInOneCard.SummaryAddressScreen.agree")}
                testID="AllInOneCard.SummaryAddressScreen:TermsAndConditionsCheckbox"
                value={hasAgreedToTerms}
                onChange={() => setHasAgreedToTerms(!hasAgreedToTerms)}
              />

              <Pressable
                testID="AllInOneCard.SummaryAddressScreen:TermsAndConditionsButton"
                onPress={() => {
                  navigation.navigate("AllInOneCard.TermsAndConditions");
                }}>
                <Typography.Text
                  size="footnote"
                  weight="medium"
                  color="complimentBase"
                  style={termsAndConditionsTextStyle}>
                  {t("AllInOneCard.SummaryAddressScreen.termsAndConditions")}
                </Typography.Text>
              </Pressable>

              <Typography.Text size="footnote" color="neutralBase+10">
                {t("AllInOneCard.SummaryAddressScreen.ofCroatia")}
              </Typography.Text>
            </View>
          </View>
          <View style={buttonContainerStyle}>
            <Button
              loading={loadingCardIssuance}
              testID="AllInOneCard.SummaryAddressScreen:Button"
              onPress={handleConfirmApply}
              disabled={!hasAgreedToTerms}>
              {t("AllInOneCard.SummaryAddressScreen.button")}
            </Button>
          </View>
        </ContentContainer>
      ) : null}

      <LoadingErrorNotification
        isVisible={!isLoadingFee && isError}
        onClose={() => navigation.goBack()}
        onRefresh={() => refetch()}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  rowLayout: {
    flexDirection: "row",
  },
});
