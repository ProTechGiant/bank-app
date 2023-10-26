import { format, isBefore } from "date-fns";
import { arSA, enUS } from "date-fns/esm/locale";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView, View, ViewStyle } from "react-native";

import { Tags } from "@/components";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TabsTypes } from "@/types/Appreciation";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import {
  AboutOrganizerSection,
  AppreciationEventDetailsSection,
  ExploreAppreciationHeader,
  RedeemAppreciationModal,
} from "../components";
import { useRedeemAppreciation } from "../hooks/query-hooks";
import { ActiveEnum, AppreciationType, RedeemFlagEnum } from "../types";

interface AppreciationDetailsScreenProps {
  appreciation: AppreciationType<boolean>;
  userInfo: {
    userTier: CustomerTierEnum;
    userFullName: string;
  };
  handleOnLikeAppreciation: (id: string, isFavourite: boolean) => Promise<null>;
}

export default function AppreciationDetailsScreen({ route }: { route: any }) {
  const {
    appreciation: {
      AppreciationId,
      isFavourite,
      VoucherCodeType,
      VoucherCode,
      Pin_Password,
      Tier,
      AppreciationName,
      AppreciationDescription,
      AppreciationTime,
      PartnerName,
      PartnerDescription,
      Location,
      ActiveFlag,
      ExpiryDate,
      ImageUrl,
      PresaleContent,
      PresaleDate,
      RedeemFlag,
    },
    userInfo: { userTier, userFullName },
    handleOnLikeAppreciation,
  }: AppreciationDetailsScreenProps = route.params;
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { isLoading: isRedeeming, mutateAsync } = useRedeemAppreciation();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(isFavourite);

  const canUserRedeem = !(Tier === 1 && userTier === CustomerTierEnum.STANDARD);

  const handleOnRedeemButtonPress = async () => {
    if (canUserRedeem) {
      try {
        setIsErrorModalVisible(false);
        await mutateAsync(AppreciationId);
        setIsRedeemModalVisible(true);
      } catch (error) {
        setIsErrorModalVisible(true);
      }
    } else {
      //TODO call the screen of the subscribe
    }
  };

  const handleOnCloseVocherPress = () => {
    navigation.navigate("Appreciation.HubScreen", { tab: TabsTypes.REDEEMED });
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("Appreciation.TermsAndConditionsScreen");
  };

  const handleOnLikeIconPress = () => {
    handleOnLikeAppreciation(AppreciationId, isFavourite).then(() => setIsLiked(liked => !liked));
  };

  const handleOnAddToAppleWalletPress = () => {
    // TODO  will be remove once Apple wallet functionality finished
    Linking.openURL("shoebox://");
  };

  const sectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["48p"],
  }));

  const termsAndConditionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
    alignItems: "center",
    width: "100%",
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  return (
    <Page insets={["left", "right"]}>
      <ScrollView>
        <ExploreAppreciationHeader
          onAppreciationFavoritePress={handleOnLikeIconPress}
          imageURL={ImageUrl}
          isLiked={isLiked}
        />
        <ContentContainer style={scrollViewStyle}>
          <Stack direction="vertical" gap="16p">
            <Tags isNew={true} isPlus={Tier === 1} userTier={userTier} />
            <Typography.Text color="neutralBase+30" weight="medium" size="title1" style={titleStyle}>
              {AppreciationName}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" weight="medium" size="title3">
              {AppreciationDescription}
            </Typography.Text>
            <View style={sectionStyle}>
              <AppreciationEventDetailsSection
                endDate={ExpiryDate}
                appreciationName={AppreciationName}
                location={Location.Name}
                preSaleDate={PresaleDate}
                preSaleDescription={PresaleContent}
              />
            </View>
            <View style={sectionStyle}>
              <AboutOrganizerSection image={ImageUrl} description={PartnerDescription} title={PartnerName} />
            </View>
            {ActiveFlag === ActiveEnum.EXPIRED ? (
              <Alert variant="error" message={t("Appreciation.AppreciationDetailsSection.notAvailable")} />
            ) : null}
            <View style={buttonStyle}>
              <Button
                variant="primary"
                loading={isRedeeming}
                onPress={handleOnRedeemButtonPress}
                disabled={ActiveFlag === ActiveEnum.EXPIRED || RedeemFlag === RedeemFlagEnum.REDEEM}>
                {canUserRedeem ? t("Appreciation.redeemAppreciation") : t("Appreciation.upgradeYourTier")}
              </Button>
            </View>
            <View style={termsAndConditionStyle}>
              <Pressable onPress={handleOnPressTermsAndConditions}>
                <Typography.Text size="footnote" color="neutralBase+30">
                  {`${t("Appreciation.ReadMoreInOur")} `}
                  <Typography.Text
                    size="footnote"
                    weight="medium"
                    color="primaryBase-30"
                    onPress={handleOnPressTermsAndConditions}>
                    {t("Appreciation.termsAndConditions")}
                  </Typography.Text>
                </Typography.Text>
              </Pressable>
            </View>
          </Stack>
        </ContentContainer>
      </ScrollView>
      <NotificationModal
        variant="error"
        title={t("Appreciation.AppreciationDetailsSection.redeemAppreciation.errorTitle")}
        message={t("Appreciation.AppreciationDetailsSection.redeemAppreciation.errorSubtitle")}
        buttons={{
          primary: (
            <Button onPress={handleOnRedeemButtonPress}>
              {t("Appreciation.AppreciationDetailsSection.redeemAppreciation.tryAgainButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsErrorModalVisible(false)}>
              {t("Appreciation.AppreciationDetailsSection.redeemAppreciation.dismissButton")}
            </Button>
          ),
        }}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <RedeemAppreciationModal
        isVisible={isRedeemModalVisible}
        isExpired={isBefore(new Date(ExpiryDate), new Date())}
        expiryDate={format(new Date(ExpiryDate), "dd/MM/yyyy", { locale: i18n.language === "en" ? enUS : arSA })}
        code={VoucherCode}
        codeType={VoucherCodeType}
        password={Pin_Password}
        title={AppreciationName}
        partnerName={PartnerName}
        userFullName={userFullName}
        location={Location.Name}
        time={format(AppreciationTime ?? new Date(PresaleDate), "p", { locale: i18n.language === "en" ? enUS : arSA })}
        handleOnAddToAppleWalletPress={handleOnAddToAppleWalletPress}
        handleOnBackButtonPress={handleOnCloseVocherPress}
      />
    </Page>
  );
}
