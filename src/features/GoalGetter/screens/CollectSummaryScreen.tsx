import { toInteger } from "lodash";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import { IconProps, InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ClockIcon from "@/features/GoldWallet/assets/ClockIcon";
import useTimer from "@/hooks/timer-hook";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MarketStatusEnum, TimerStatusEnum } from "@/types/timer";

export default function CollectSummaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { timer, resumeTimer, timerStatus } = useTimer(); //TODO will destruct startTimer here when integrate with api

  const detailsData = [
    {
      label: t("GoalGetter.CollectSummaryScreen.from"),
      value: "Gold Wallet",
    },
    {
      label: t("GoalGetter.CollectSummaryScreen.to"),
      value: "Current account",
    },
    {
      label: t("GoalGetter.CollectSummaryScreen.originalAmount"),
      value: "240 Grams (50,400.00 SAR)",
    },
    {
      label: t("GoalGetter.CollectSummaryScreen.withdrawalQty"),
      value: "240 g",
    },
    {
      label: t("GoalGetter.CollectSummaryScreen.gramValue"),
      value: `240 g`,
    },
    {
      label: t("GoalGetter.CollectSummaryScreen.total"),
      value: "240 g x 210.00 = 50,400.00 SAR",
    },
    {
      label: t("GoalGetter.CollectSummaryScreen.remainingAmount"),
      value: "0 Grams (0.00 SAR)",
    },
  ];

  const handleOnDonePress = () => {
    navigation.goBack();
    //TODO navigate to the otp page
  };

  const handleOnRefreshTimerPress = () => {
    // TODO will use refresh here to update the price and timer  refetch();
    resumeTimer();
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.medium,
    flex: 1,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const detailsRowStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  const detailsTableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.small,
  }));

  const doneButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const timerTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const timerExpiredTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["8p"],
  }));

  const statusSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: theme.spacing["48p"],
  }));

  const timerIconColor = useThemeStyles<IconProps>(theme => ({ color: theme.palette["primaryBase-40"] }));
  const infoIconColor = useThemeStyles<IconProps>(theme => ({ color: theme.palette["complimentBase-20"] }));

  return (
    <Page backgroundColor="neutralBase+30">
      <View style={modalContainerStyle}>
        <NavHeader title="" end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <ContentContainer>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase+30" size="title1" weight="bold">
              {t("GoalGetter.CollectSummaryScreen.collectSummary")}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={detailsTableContainerStyle}>
            {detailsData.map((item, index) => {
              if (index === 0) {
                return (
                  <Stack direction="vertical" key={index} style={[detailsRowStyle, { borderBottomWidth: 1 }]}>
                    <Typography.Text color="neutralBase" size="footnote" weight="regular">
                      {item?.label}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      {item?.value}
                    </Typography.Text>
                  </Stack>
                );
              } else {
                return (
                  <Stack
                    direction="horizontal"
                    align="center"
                    justify="space-between"
                    key={index}
                    style={[detailsRowStyle, { borderBottomWidth: index < detailsData.length - 1 ? 1 : 0 }]}>
                    <Typography.Text color="neutralBase" size="footnote" weight="regular">
                      {item.label}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      {item.value}
                    </Typography.Text>
                  </Stack>
                );
              }
            })}
          </Stack>
          <Stack direction="vertical" style={statusSectionStyle}>
            <ClockIcon color={timerIconColor.color} />
            {/* condition will be marketStatus === MarketStatusEnum.CLOSED ? */}
            {MarketStatusEnum.CLOSED ? (
              <>
                <Typography.Text color="errorBase-10" size="footnote">
                  {t("GoalGetter.CollectSummaryScreen.marketClosed")}
                </Typography.Text>
                <Typography.Text color="neutralBase-10" align="center" size="footnote">
                  {t("GoalGetter.CollectSummaryScreen.tryAgainWhenMarketOpen")}
                </Typography.Text>
              </>
            ) : (
              <>
                {timerStatus === TimerStatusEnum.RUNNING ? (
                  <Typography.Text style={timerTextStyle}>
                    {t("GoalGetter.CollectSummaryScreen.priceWillExpireIn")} {toInteger(timer / 60.0)}:{timer % 60}{" "}
                    {t("GoalGetter.CollectSummaryScreen.seconds")}
                  </Typography.Text>
                ) : (
                  <>
                    <Typography.Text style={timerExpiredTextStyle}>
                      {t("GoalGetter.CollectSummaryScreen.priceExpired")}
                    </Typography.Text>
                    <Button size="mini" variant="primary-warning" onPress={handleOnRefreshTimerPress}>
                      <Typography.Text color="complimentBase">
                        {t("GoalGetter.CollectSummaryScreen.refresh")}
                      </Typography.Text>
                    </Button>
                  </>
                )}
              </>
            )}
          </Stack>
          <Accordion
            title={t("GoalGetter.CollectSummaryScreen.whyPricesChange")}
            icon={<InfoCircleIcon color={infoIconColor.color} />}>
            <Typography.Text color="neutralBase+10" size="footnote">
              {t("GoalGetter.CollectSummaryScreen.goldPricesChanging")}
            </Typography.Text>
          </Accordion>
        </ContentContainer>
        <View style={doneButtonContainerStyle}>
          <Button onPress={handleOnDonePress}>{t("GoldWallet.done")}</Button>
        </View>
      </View>
    </Page>
  );
}
