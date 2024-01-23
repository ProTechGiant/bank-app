import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StatusBar, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { SIGN_IN_METHOD } from "@/features/SignIn/constants";
import { useLoginUser } from "@/features/SignIn/hooks/query-hooks";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";
import { getUniqueDeviceId } from "@/utils";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import AccountCreated from "../assets/account-created.svg";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useAccountStatus, useGetCustomerBasicInfo } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";
import { Status } from "../types";

type SuccessScreen = RouteProp<OnboardingStackParams, "Onboarding.SuccessScreen">;

export default function SuccessScreen() {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const addToast = useToasts();
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(true);
  const { data, refetch } = useAccountStatus(isfetchingAccountStatus);
  const auth = useAuthContext();
  const { params } = useRoute<SuccessScreen>();

  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const { mutateAsync: searchForUser } = useSearchUserByNationalId();
  const { nationalId, mobileNumber, customerInfo } = useOnboardingContext();
  const { data: customerBasicInfo } = useGetCustomerBasicInfo(customerInfo?.CustomerId);

  const accountStatus: Status | undefined = data?.OnboardingStatus as Status;
  const { mutateAsync, isLoading: isLoadingLoginApi } = useLoginUser();

  useEffect(() => {
    if (accountStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);

      //TODO: Toast creates branding design system inconsistency that would need to be fixed in the future
      addToast({
        variant: "success",
        message: t("Onboarding.LandingScreen.success.bannerMessage"),
        closable: true,
      });
    } else if (accountStatus === "DECLINED") {
      setIsfetchingAccountStatus(false);
    }
  }, [accountStatus, refetch, t, addToast]);

  const handleOnGetStartedPress = async () => {
    await getAuthenticationToken();
    if (nationalId && mobileNumber) {
      const customer = await searchForUser({ NationalId: nationalId, MobileNumber: mobileNumber });
      const deviceId = await getUniqueDeviceId();
      setItemInEncryptedStorage("user", JSON.stringify({ ...customer, DeviceId: deviceId, DeviceStatus: "R" }));
      const response = await mutateAsync({
        passCode: params.passcode,
        nationalId: nationalId,
        method: SIGN_IN_METHOD.PASS_CODE,
      });
      if (customer.CustomerId && response.AccessToken) auth.authenticate(customer.CustomerId, response.AccessToken);
    }
  };

  const handleOnShare = async () => {
    try {
      const message = `Name: ${customerBasicInfo?.CustomerFullName} \nAccount Number: ${customerBasicInfo?.AccountNumber} \nIBAN: ${customerBasicInfo?.IBAN}`;

      const shareOptions = {
        message: message,
      };

      await Share.share(shareOptions);
    } catch (error) {
      warn("Error sharing:", JSON.stringify(error.message));
    }
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const customerInfoStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    paddingVertical: theme.spacing["12p"],
  }));

  const customerInfoBox = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    paddingHorizontal: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
    marginTop: theme.spacing["20p"],
  }));

  const backgroundAngledColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const svgHeight = height * 0.45; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed

  return (
    <Page backgroundColor="primaryBase">
      <NavHeader
        withBackButton={false}
        variant="white"
        backgroundAngledColor={backgroundAngledColor}
        end={customerBasicInfo ? <NavHeader.ShareButton onPress={handleOnShare} /> : <></>}
      />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <View style={{ flex: 1 }}>
          <View style={headerSuccessStyle}>
            <AccountCreated width={svgWidth} />
            <Stack direction="vertical" align="center" gap="8p">
              <Typography.Text align="center" size="large" weight="bold" color="neutralBase-60">
                {t("Onboarding.LandingScreen.success.title")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase-60">
                {t("Onboarding.LandingScreen.success.subtitle")}
              </Typography.Text>
            </Stack>
          </View>
          {customerBasicInfo ? (
            <Stack direction="vertical" style={customerInfoBox}>
              <Stack direction="horizontal" style={customerInfoStyle} justify="space-between">
                <Typography.Text align="center" size="footnote" color="neutralBase-20">
                  {t("Onboarding.LandingScreen.success.customerInfo.name")}
                </Typography.Text>
                <Typography.Text
                  align="center"
                  size="footnote"
                  weight="regular"
                  color="neutralBase-40"
                  numberOfLines={1}
                  style={styles.nameContainer}>
                  {customerBasicInfo?.CustomerFullName}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" style={customerInfoStyle} justify="space-between">
                <Typography.Text align="center" size="footnote" color="neutralBase-20">
                  {t("Onboarding.LandingScreen.success.customerInfo.accountNumber")}
                </Typography.Text>
                <Typography.Text align="center" size="footnote" color="neutralBase-40">
                  {customerBasicInfo?.AccountNumber}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" style={customerInfoStyle} justify="space-between">
                <Typography.Text align="center" size="footnote" color="neutralBase-20">
                  {t("Onboarding.LandingScreen.success.customerInfo.ibanNumber")}
                </Typography.Text>
                <Typography.Text align="center" size="footnote" color="neutralBase-40">
                  {customerBasicInfo?.IBAN}
                </Typography.Text>
              </Stack>
            </Stack>
          ) : null}
        </View>
        <View style={buttonContainerStyle}>
          <Button loading={isLoadingLoginApi} color="dark" onPress={handleOnGetStartedPress}>
            {t("Onboarding.LandingScreen.pending.successTitle")}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  nameContainer: {
    maxWidth: "80%",
  },
});
