import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TextStyle, View } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import {
  RewardsHeaderIcon,
  RewardsIllustrationsIcon,
  RewardsSwitchIcon,
  RightIcon,
  WaveBackground,
} from "../assets/icons";
import { RewardsEmpty, RewardsItem, RewardUpgradeText } from "../components";
import { AIOtype } from "../constants";
import { useCashback, useSwitchRewardsType } from "../hooks/query-hooks";

export default function RewardsScreen() {
  const { t } = useTranslation();
  const [rewardsType, setRewardsType] = useState<"Cashback" | "Mokafa">("Cashback");
  const [isConfirmRewardTypeVisible, setIsConfirmRewardTypeVisible] = useState<boolean>(false);
  const [isSuccessRewardTypeVisible, setIsSuccessRewardTypeVisible] = useState<boolean>(false);
  const isCashBackType = rewardsType === "Cashback";
  const route = useRoute<RouteProp<AuthenticatedStackParams, "AllInOneCard.Rewards">>();
  const isNeraCard = route.params?.cardType === AIOtype.Nera.valueOf();
  const { mutateAsync: switchRewardType, isLoading: isLoadingRewardSwitch } = useSwitchRewardsType();
  //TODO : API is mocked at the moment so it accepting ny cardexid
  const { data: cashback, isLoading: loadingCashback } = useCashback({ CardEXID: "1234" });

  const appBarStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["32p"],
    backgroundColor: theme.palette["neutralBase+30"],
    paddingVertical: theme.spacing["32p"],
  }));

  const { backgroundColor: appBarColor } = useThemeStyles<TextStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const { backgroundColor: rightArrowColor } = useThemeStyles<TextStyle>(theme => ({
    backgroundColor: theme.palette.successBase,
  }));

  const listStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const handleRewardsSwitchPress = () => {
    setIsConfirmRewardTypeVisible(true);
  };

  const handleConfirmSwitchRewardsType = async () => {
    try {
      // TODO : static AccountNumber number will be replaced when we have actual acccont number
      await switchRewardType({ AccountNumber: "0003663330000000430", RewardType: rewardsType });
      setIsConfirmRewardTypeVisible(false);
      setRewardsType(rewardsType === "Cashback" ? "Mokafa" : "Cashback");
      delayTransition(() => {
        setIsSuccessRewardTypeVisible(true);
      });
    } catch (error) {
      warn("AIO Card", "Could not switch Rewards Type: ", JSON.stringify(error));
    }
  };

  const handleExploreMore = () => {
    // TODO : handle this later
  };

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page
      testID="AllInOneCard.RewardsScreen:Page"
      insets={["left", "right", "top"]}
      backgroundColor={isCashBackType ? "neutralBase-60" : "neutralBase+30"}>
      <NavHeader
        withBackButton={true}
        title={isCashBackType ? t("AllInOneCard.Rewards.title") : ""}
        backgroundColor={appBarColor}
        backgroundAngledColor={NavHeaderColor}
      />
      {isCashBackType ? (
        <>
          <Stack direction="vertical" style={appBarStyle} align="center" gap="16p">
            <RewardsHeaderIcon />
            <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
              {t("AllInOneCard.Rewards.labelEarnedCashback")}
            </Typography.Text>
            <Stack direction="horizontal" align="baseline">
              {/* TODO: amount is hardcoded at the moment , will be removed when api is available  */}
              <FormatTransactionAmount
                amount={1920.23}
                isPlusSignIncluded={false}
                integerSize="large"
                decimalSize="body"
                color="neutralBase-50"
                isCurrencyIncluded={false}
                currencyColor="neutralBase-30"
              />
              <Typography.Text color="neutralBase-50" size="body" weight="medium">
                {" "}
                {t("AllInOneCard.Rewards.sar")}
              </Typography.Text>
            </Stack>
            <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
              {t("AllInOneCard.Rewards.labelLastMonth")}
            </Typography.Text>
            {isNeraCard ? <RewardUpgradeText amount={170} /> : null}
          </Stack>
          <WaveBackground color={appBarColor} width="100%" />
        </>
      ) : null}

      <ContentContainer>
        {isCashBackType ? (
          <>
            <Typography.Text size="title3" weight="medium">
              {t("AllInOneCard.Rewards.labelTotalCashBack")}
            </Typography.Text>
            {loadingCashback ? (
              <FullScreenLoader />
            ) : cashback && cashback.CashbackSummary.MonthlyHistory.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={cashback.CashbackSummary.MonthlyHistory}
                keyExtractor={item => item.Month}
                renderItem={({ item }) => {
                  return <RewardsItem item={item} />;
                }}
                style={listStyle}
              />
            ) : (
              <RewardsEmpty />
            )}
          </>
        ) : (
          <View style={styles.mokafaContainer}>
            <RewardsIllustrationsIcon />
            <Stack direction="vertical" align="center" justify="center" gap="8p">
              <Typography.Text color="neutralBase-60">{t("AllInOneCard.Rewards.earnedMokafaaPoints")}</Typography.Text>
              <Stack direction="horizontal" align="baseline" justify="center" gap="8p">
                {/* TODO: value is static at the moment , will be removed when api is available  */}
                <Typography.Text color="neutralBase-60" size="xlarge" weight="medium">
                  500
                </Typography.Text>
                <Typography.Text color="neutralBase-50" size="body" weight="medium">
                  {t("AllInOneCard.Rewards.pts")}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" align="center">
                <Typography.Text color="successBase" size="footnote" weight="medium" onPress={handleExploreMore}>
                  {t("AllInOneCard.Rewards.exploreYourPoints")}
                </Typography.Text>
                <RightIcon color={rightArrowColor} />
              </Stack>
            </Stack>
          </View>
        )}

        <Button
          iconLeft={<RewardsSwitchIcon />}
          onPress={handleRewardsSwitchPress}
          variant="secondary"
          color={isCashBackType ? "light" : "dark"}>
          {isCashBackType
            ? t("AllInOneCard.Rewards.buttonSwitchToMokafaa")
            : t("AllInOneCard.Rewards.buttonSwitchToCashBack")}
        </Button>
      </ContentContainer>

      <NotificationModal
        onClose={() => setIsConfirmRewardTypeVisible(false)}
        buttons={{
          primary: (
            <Button loading={isLoadingRewardSwitch} onPress={handleConfirmSwitchRewardsType}>
              {t("AllInOneCard.Rewards.confirmationModal.buttonSwitch")}
            </Button>
          ),
        }}
        message={
          isCashBackType
            ? t("AllInOneCard.Rewards.confirmationModal.messageSwitchToMokafaa")
            : t("AllInOneCard.Rewards.confirmationModal.messageSwitchToCashback")
        }
        isVisible={isConfirmRewardTypeVisible}
        title={
          isCashBackType
            ? t("AllInOneCard.Rewards.confirmationModal.titleSwitchToMokafaa")
            : t("AllInOneCard.Rewards.confirmationModal.titleSwitchToCashback")
        }
        variant="warning"
      />

      <NotificationModal
        onClose={() => setIsSuccessRewardTypeVisible(false)}
        buttons={{
          primary: (
            <Button onPress={() => setIsSuccessRewardTypeVisible(false)}>
              {t("AllInOneCard.Rewards.successModal.buttonDone")}
            </Button>
          ),
        }}
        isVisible={isSuccessRewardTypeVisible}
        title={
          isCashBackType
            ? t("AllInOneCard.Rewards.successModal.titleSwitchToCashback")
            : t("AllInOneCard.Rewards.successModal.titleSwitchToMokafaa")
        }
        variant="success"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  mokafaContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },
});
