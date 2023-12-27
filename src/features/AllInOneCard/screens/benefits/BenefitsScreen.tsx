import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { NoRewardIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../../AllInOneCardStack";
import { SellOutlinedIcon } from "../../assets/icons";
import { BenefitCard, SearchInput } from "../../components";
import { ACTIVE_BENEFITS, ALL_BENEFITS, STATUS_ACTIVE } from "../../constants";
import { useGetCustomerSubscriptions } from "../../hooks/query-hooks";
import { PartnerList } from "../../types";

export default function BenefitsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.BenefitsScreen">>();
  const pill = route.params?.activePill;
  const activationStatus = route.params?.activationStatus;
  const partnerName = route.params?.partnerName;
  const {
    otherAioCardProperties: { aioCardId },
  } = useAuthContext();
  const { data: customerSubscriptions, isLoading, refetch } = useGetCustomerSubscriptions(aioCardId ?? "");

  const [searchText, setSearchText] = useState<string>("");
  const [activePill, setActivePill] = useState<string>(pill ? pill : ALL_BENEFITS);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState<boolean>(false);
  const [benefits, setBenefits] = useState<PartnerList[]>([]);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const activeBenefits = useMemo(() => {
    return customerSubscriptions?.PartnersList.filter(
      benefit => benefit.CustomerSubscription?.Status === STATUS_ACTIVE
    );
  }, [customerSubscriptions]);

  const inactiveBenefits = useMemo(() => {
    return customerSubscriptions?.PartnersList.filter(
      benefit => benefit.CustomerSubscription?.Status !== STATUS_ACTIVE
    );
  }, [customerSubscriptions]);
  const currentBenefits = activePill === ALL_BENEFITS ? inactiveBenefits : activeBenefits;

  useEffect(() => {
    if (activationStatus === "failed") {
      setIsWarningModalVisible(true);
    } else if (activationStatus === "success") {
      setIsAlertVisible(true);
      refetch();
    }
  }, [activationStatus]);

  useEffect(() => {
    if (currentBenefits && !isLoading && currentBenefits.length > 0) {
      if (searchText === "") {
        setBenefits(currentBenefits);
      } else {
        const filteredBenefits = currentBenefits.filter(benefit =>
          benefit.PartnerItem.PartnerName.toLowerCase().includes(searchText.toLowerCase())
        );
        setBenefits(filteredBenefits);
      }
    }
  }, [searchText, currentBenefits, isLoading]);

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchText === "") return;
    else setSearchText(text);
  };

  const handleOnCancelPress = () => {
    setSearchText("");
  };
  const handleOnCardPress = (item: PartnerList) => {
    navigation.navigate("AllInOneCard.ActivationScreen", {
      PartnerItem: item,
    });
    setSearchText("");
  };
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["12p"],
    width: "100%",
    flex: 1,
  }));
  const scrollViewContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));
  const infoBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));
  const navBackButtonColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["left", "right"]} backgroundColor="neutralBase-40">
      <NavHeader
        variant="angled"
        title={t("AllInOneCard.BenefitsScreen.benefits")}
        backgroundAngledColor={navBackButtonColor}
        onBackPress={() => {
          navigation.navigate("Home.HomeTabs", { screen: "Cards" });
        }}>
        <View style={styles.containerPosition}>
          <SearchInput
            onClear={handleOnCancelPress}
            onSearch={handleOnChangeText}
            placeholder={t("AllInOneCard.BenefitsScreen.search")}
            value={searchText}
          />
          {isAlertVisible ? (
            <View style={styles.alertContainer}>
              <Alert
                variant="success"
                end={<Alert.CloseEndButton onPress={() => setIsAlertVisible(false)} />}
                isExpanded={true}>
                <Typography.Text size="footnote" weight="bold">
                  {I18nManager.isRTL ? "" : partnerName}
                  <Typography.Text size="footnote">
                    {t("AllInOneCard.BenefitsScreen.alertMessagePartOne")}
                  </Typography.Text>
                  {I18nManager.isRTL ? partnerName : ""}
                  <Typography.Text size="footnote">
                    {t("AllInOneCard.BenefitsScreen.alertMessagePartTwo")}
                  </Typography.Text>
                </Typography.Text>
              </Alert>
            </View>
          ) : null}
        </View>
      </NavHeader>
      {isLoading ? (
        <FullScreenLoader />
      ) : currentBenefits && activeBenefits ? (
        <View style={containerStyle}>
          <Stack direction="horizontal" gap="8p">
            <Pill isActive={activePill === ALL_BENEFITS} onPress={() => setActivePill(ALL_BENEFITS)}>
              {t("AllInOneCard.BenefitsScreen.all")}
            </Pill>
            <Pill isActive={activePill === ACTIVE_BENEFITS} onPress={() => setActivePill(ACTIVE_BENEFITS)}>
              {t("AllInOneCard.BenefitsScreen.activeBenefits")}
            </Pill>
          </Stack>
          {activePill === ALL_BENEFITS && currentBenefits.length > 0 && activeBenefits?.length < 2 ? (
            <View style={infoBoxContainerStyle}>
              <InfoBox
                variant="primary"
                borderPosition="start"
                title={t("AllInOneCard.BenefitsScreen.infoMessage")}
                icon={<SellOutlinedIcon />}
              />
            </View>
          ) : null}
          {currentBenefits.length > 0 ? (
            <ScrollView style={scrollViewContainerStyle}>
              <Stack direction="vertical" gap="12p">
                {benefits?.map(benefit => (
                  <BenefitCard
                    status={benefit.CustomerSubscription.Status}
                    onCardPress={handleOnCardPress.bind(null, benefit)}
                    partnerItem={benefit.PartnerItem}
                  />
                ))}
              </Stack>
            </ScrollView>
          ) : (
            <Stack direction="vertical" justify="center" align="center" gap="16p" flex={0.6}>
              <NoRewardIcon />
              <Stack direction="vertical" gap="4p" align="center">
                <Typography.Text size="callout" weight="medium">
                  {t("AllInOneCard.BenefitsScreen.benefitsNotFound")}
                </Typography.Text>
                <Typography.Text size="footnote" color="neutralBase">
                  {activePill === ALL_BENEFITS
                    ? t("AllInOneCard.BenefitsScreen.allPillBenefitsNotFound")
                    : t("AllInOneCard.BenefitsScreen.activePillBenefitsNotFound")}
                </Typography.Text>
              </Stack>
            </Stack>
          )}
        </View>
      ) : null}

      <NotificationModal
        variant="warning"
        title={t("AllInOneCard.BenefitsScreen.warningModal.title")}
        message={t("AllInOneCard.BenefitsScreen.warningModal.message")}
        isVisible={isWarningModalVisible}
        buttons={{
          primary: (
            <Button onPress={() => setIsWarningModalVisible(false)} testID="AllInOneCard.BenefitsScreen:primaryButton">
              {t("AllInOneCard.BenefitsScreen.warningModal.okButton")}
            </Button>
          ),
        }}
        testID="AllInOneCard.BenefitsScreen:WarningModal"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    width: "100%",
  },
  containerPosition: {
    position: "relative",
  },
});
