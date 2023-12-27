import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../../AllInOneCardStack";
import { BottomCardIcon, TopCardIcon } from "../../assets/icons";
import { EXISTING_ACTIVE_SUBSCRIPTION, MONTHLY_SUBSCRIPTION } from "../../constants";
import { useSubscription } from "../../hooks/query-hooks";

export default function ActivationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, isLoading } = useSubscription();

  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.ActivationScreen">>();
  const partnerItem = route.params.PartnerItem;
  const {
    otherAioCardProperties: { aioCardId },
  } = useAuthContext();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 40;
  const aspectRatioForTopCard = 178 / 350;
  const topCardHeight = cardWidth * aspectRatioForTopCard;
  const aspectRatioForBottomCard = 352 / 350;
  const bottomCardHeight = cardWidth * aspectRatioForBottomCard;
  const dashedLineWidth = cardWidth - 36;
  const handleOnActivePress = async () => {
    try {
      await mutateAsync({
        CardIdentifier: aioCardId ?? "",
        PartnerCode: partnerItem.PartnerItem.PartnerCode,
      });
      navigation.navigate("AllInOneCard.BenefitsScreen", {
        activationStatus: "success",
        partnerName: partnerItem.PartnerItem.PartnerName,
      });
    } catch (error) {
      const errorCode = JSON.parse(JSON.stringify(error)).errorContent.Errors[0].ErrorCode;
      if (EXISTING_ACTIVE_SUBSCRIPTION === errorCode) {
        navigation.navigate("AllInOneCard.BenefitsScreen", {
          activationStatus: "failed",
        });
      }
    }
  };

  const boxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-10"],
    marginHorizontal: 8,
    width: cardWidth - 40,
  }));
  const dashedLineStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 1,
    width: dashedLineWidth,
    borderColor: theme.palette["neutralBase-10"],
    borderStyle: "dashed",
  }));
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["20p"],
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
    width: "100%",
    flex: 1,
  }));
  const marginItemStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["64p"],
    height: 75,
  }));
  const stackContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));
  const gapBottomItems = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
  }));
  const bottomBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["16p"],
  }));
  const boxTableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["12p"],
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: theme.palette["neutralBase-10"],
  }));
  const navBackButtonColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase+30" testID="AllInOneCard.CardReviewScreen:Page">
      <NavHeader
        variant="white"
        title={`${partnerItem.PartnerItem.PartnerName} ${t("AllInOneCard.BenefitsScreen.activation")}`}
        withBackButton={false}
        backgroundAngledColor={navBackButtonColor}
        end={
          <NavHeader.CloseEndButton
            onPress={() => {
              navigation.goBack();
            }}
            color="neutralBase-60"
          />
        }
        testID="AllInOneCard.CardReviewScreen:NavHeader"
      />
      <View style={containerStyle}>
        <Stack direction="vertical" align="center">
          <TopCardIcon width={cardWidth} height={topCardHeight} />
          <View style={dashedLineStyle} />
          <BottomCardIcon width={cardWidth} height={bottomCardHeight} />
          <View style={styles.content}>
            <View style={marginItemStyle}>
              <SvgIcon uri={partnerItem.PartnerItem.PartnerImage} width={235} height={75} />
            </View>
            <Stack direction="vertical" align="center" gap="32p" style={stackContainerStyle}>
              <Stack direction="vertical" align="center" gap="8p" style={styles.widthContent}>
                <Typography.Text color="neutralBase-60" size="title2" align="center" weight="medium">
                  {`${partnerItem.PartnerItem.PartnerName} ${t("AllInOneCard.BenefitsScreen.plan")}`}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="footnote" align="center">
                  {partnerItem.PartnerItem.PartnerDescription}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" style={boxContainerStyle}>
                <Stack direction="vertical" gap="4p" style={boxTableContainerStyle}>
                  <Typography.Text color="neutralBase" size="footnote">
                    {t("AllInOneCard.BenefitsScreen.activationPlan")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-60" size="callout">
                    {`${partnerItem.PartnerItem.PartnerName} - ${
                      partnerItem.PaymentPlan === MONTHLY_SUBSCRIPTION
                        ? t("AllInOneCard.BenefitsScreen.monthlySubscription")
                        : t("AllInOneCard.BenefitsScreen.yearlySubscription")
                    }`}
                  </Typography.Text>
                </Stack>
                <Stack direction="vertical" gap="4p" style={bottomBoxContainerStyle}>
                  <Typography.Text color="neutralBase" size="footnote">
                    {t("AllInOneCard.BenefitsScreen.subscriptionFees")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-60" size="footnote">
                    {t("AllInOneCard.BenefitsScreen.free")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase" size="caption1">
                    {t("AllInOneCard.BenefitsScreen.messageActivation")}
                  </Typography.Text>
                </Stack>
              </Stack>
            </Stack>
          </View>
        </Stack>
        <View style={gapBottomItems}>
          <CheckboxInput
            label={t("AllInOneCard.BenefitsScreen.confirmMessage")}
            value={isCheckboxChecked}
            onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
          />
          <Button color="dark" disabled={!isCheckboxChecked} onPress={handleOnActivePress} loading={isLoading}>
            {t("AllInOneCard.BenefitsScreen.active")}
          </Button>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    position: "absolute",
    top: 43,
  },
  widthContent: {
    width: "80%",
  },
});
