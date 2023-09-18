import { format, isBefore } from "date-fns";
import { arSA, enUS } from "date-fns/esm/locale";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { Tags } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import {
  AboutOrganizerSection,
  AppreciationEventDetailsSection,
  ExploreAppreciationHeader,
  RedeemAppreciationModal,
} from "../components";
import { useRedeemAppreciation } from "../hooks/query-hooks";
import { Pin_Password, VoucherCode, VoucherCodeType } from "../mock";
import { AppreciationType } from "./../types";

interface AppreciationDetailsScreenProps {
  appreciation: AppreciationType;
  userInfo: {
    userTier: CustomerTierEnum;
    userFullName: string;
  };
}

export default function AppreciationDetailsScreen({ route }: { route: any }) {
  const {
    appreciation: {
      ImageUrl,
      ExpiryDate,
      VoucherDescription,
      PreSaleDescription,
      VoucherName,
      VoucherId,
      Location,
      PartnerName,
      PreSaleDateTime,
      Tier,
      CreationDate,
    },
    userInfo: { userTier, userFullName },
  }: AppreciationDetailsScreenProps = route.params;
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const redeemAppreciation = useRedeemAppreciation();

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState<boolean>(false);

  const canUserRedeem = !(Tier === 1 && userTier === CustomerTierEnum.STANDARD);

  const handleOnRedeemButtonPress = async () => {
    if (canUserRedeem) {
      try {
        setIsErrorModalVisible(false);
        await redeemAppreciation.mutateAsync(VoucherId);
        setIsRedeemModalVisible(true);
      } catch (error) {
        setIsErrorModalVisible(true);
      }
    } else {
      //call the screen of the subscribe
    }
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("Appreciation.TermsAndConditionsScreen");
  };

  const handleOnAppreciationFavoritePress = () => {
    setIsLiked(!isLiked);
    //TODO
  };

  const handleOnAddToAppleWalletPress = () => {
    //TODO apple wallet logic
  };

  const handleOnViewDetailsPress = () => {
    //TODO view details logic
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
          onAppreciationFavoritePress={handleOnAppreciationFavoritePress}
          imageURL={ImageUrl}
          isLiked={isLiked}
        />
        <ContentContainer style={scrollViewStyle}>
          <Stack direction="vertical" gap="16p">
            <Tags isNew={true} isPlus={Tier === 1} userTier={userTier} />
            <Typography.Text color="neutralBase+30" weight="medium" size="title1" style={titleStyle}>
              {VoucherName}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" weight="medium" size="title3">
              {VoucherDescription}
            </Typography.Text>
            <View style={sectionStyle}>
              <AppreciationEventDetailsSection
                endDate={format(new Date(CreationDate), "dd/MM/yyyy · hh:mm")}
                location={Location.Name}
                preSaleDate={format(new Date(PreSaleDateTime), "dd/MM/yyyy · hh:mm")}
                preSaleDescription={PreSaleDescription}
              />
            </View>
            <View style={sectionStyle}>
              <AboutOrganizerSection image={ImageUrl} description={VoucherDescription} title={PartnerName} />
            </View>
            <View style={buttonStyle}>
              <Button variant="primary" onPress={handleOnRedeemButtonPress}>
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
        setIsVisible={setIsRedeemModalVisible}
        isExpired={isBefore(new Date(ExpiryDate), new Date())}
        expiryDate={format(new Date(ExpiryDate), "dd/MM/yyyy", { locale: i18n.language === "en" ? enUS : arSA })}
        code={VoucherCode}
        codeType={VoucherCodeType}
        password={Pin_Password}
        title={VoucherName}
        partnerName={PartnerName}
        userFullName={userFullName}
        location={Location.Name}
        time={format(new Date(CreationDate), "p", { locale: i18n.language === "en" ? enUS : arSA })}
        handleOnAddToAppleWalletPress={handleOnAddToAppleWalletPress}
        handleOnViewDetailsPress={handleOnViewDetailsPress}
      />
    </Page>
  );
}
