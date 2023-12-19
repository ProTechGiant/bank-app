import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThreeDotsVerticalIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import footerCardImage from "../assets/footer-card-image.png";
import GoldEndedImage from "../assets/gold-ended-image.svg";
import BackgroundImage from "../assets/summary-header-Image.png";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";
import { ProductTypeName } from "../types";

export default function GoalDeleteSummaryScreen() {
  const { t } = useTranslation();
  const {
    params: { goal, productType, goalName, goalImage, goalId },
  } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.GoalSummaryScreen">>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const otpFlow = useOtpFlow();
  const { mutateAsync: generateOtp } = useGoalGetterOTP();
  const detailsData = [
    {
      label: t("GoalGetter.GoalSummaryScreen.product"),
      value:
        productType === ProductTypeName.GOLD
          ? t("GoalGetter.GoalSummaryScreen.goldWallet")
          : productType === ProductTypeName.SAVING_POT
          ? t("GoalGetter.GoalSummaryScreen.savingPot")
          : t("GoalGetter.GoalSummaryScreen.mutualFund"),
      showStatus: true,
    },
    {
      label:
        productType === ProductTypeName.GOLD
          ? t("GoalGetter.GoalSummaryScreen.investedAmount")
          : t("GoalGetter.GoalSummaryScreen.originalBalance"),
      value: `${
        productType === ProductTypeName.GOLD
          ? goal.InvestedAmount
          : productType === ProductTypeName.SAVING_POT
          ? null
          : goal.InvestedAmount
      }  ${t("GoalGetter.GoalSummaryScreen.SAR")}`,
      showStatus: productType === ProductTypeName.SAVING_POT ? false : true,
    },
    {
      label: t("GoalGetter.GoalSummaryScreen.totalValue"),
      value: `${goal.TotalBalance}  ${t("GoalGetter.GoalSummaryScreen.SAR")}`,
      showStatus: true,
    },
    {
      label: t("GoalGetter.GoalSummaryScreen.unitValue"),
      value:
        productType === ProductTypeName.SAVING_POT || productType === ProductTypeName.GOLD
          ? null
          : "1 Unit = 10.25 SAR", // TODO  missing from API response
      showStatus: productType === ProductTypeName.SAVING_POT || productType === ProductTypeName.GOLD ? false : true,
    },
  ];

  const handleOnHeaderIconPress = () => {
    // TODO will be nagigate when the next screen created
  };

  const handleOnCollectButtonPress = () => {
    // TODO will be nagigate when the next screen created
  };
  const navigateToOtpFlow = async () => {
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.CollectSummaryScreen",
        },
        otpVerifyMethod: `goal-delete`,
        otpOptionalParams: {
          goalId,
        },
        onOtpRequest: () => {
          return generateOtp();
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
              title: t("GoalGetter.GoalSummaryScreen.goalEnded"),
              subtitle: t("GoalGetter.GoalSummaryScreen.goalEndedMessage"),
              viewTransactions: false,
              icon: <GoldEndedImage />,
            });
          }
        },
      });
    } catch (error) {}
  };

  const handleOnEndGoalPress = () => {
    navigateToOtpFlow();
  };

  const balanceCardContainer = useThemeStyles<ViewStyle>(() => ({
    position: "relative",
    height: Platform.OS === "android" ? 286 : 286 + insets.top,
  }));

  const headerCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 2,
    borderColor: "#fff", // TODO doesnot exist in theme
    borderRadius: theme.radii.xlarge, // TODO doesnot exist in theme
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
  }));

  const detailsRowStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  const detailsTableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    marginVertical: theme.spacing["20p"],
    borderRadius: theme.radii.small,
  }));

  const ProductDetailTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const doneButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-end",
    width: "100%",
    marginTop: theme.spacing["64p"],
  }));

  const internalCircleShapeStyle = useThemeStyles<ViewStyle>(_theme => ({
    height: 80,
    width: 84,
    borderWidth: 7,
    backgroundColor: "#FFF", // TODO doesnot exist in theme
    borderColor: "#FFF", // TODO doesnot exist in theme
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  }));
  const barColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      <StatusBar backgroundColor={barColor} barStyle="light-content" />
      <ScrollView>
        <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
          <ImageBackground source={BackgroundImage} style={styles.cardBackground} resizeMode="cover">
            {/* TODO title will replace actuall data once integrate with api */}
            <NavHeader
              title={goalName}
              variant="white"
              end={<NavHeader.IconEndButton icon={<ThreeDotsVerticalIcon />} onPress={handleOnHeaderIconPress} />}
            />
            <Stack direction="vertical" style={headerCardContainerStyle} gap="8p">
              <Stack direction="horizontal" justify="space-between" align="center" style={styles.internalHeaderContent}>
                <Stack direction="vertical">
                  <Typography.Text size="footnote" color="neutralBase-60">
                    {t("GoalGetter.GoalSummaryScreen.targetGoal")}
                  </Typography.Text>
                  <Typography.Text size="xlarge" weight="bold" color="neutralBase-60">
                    {formatCurrency(goal.TargetAmount)}
                  </Typography.Text>
                </Stack>
                <Stack direction="horizontal" justify="center" align="center" style={styles.circleShapeContainer}>
                  <View style={internalCircleShapeStyle}>
                    <Image source={{ uri: goalImage }} style={styles.circleShapeImage} />
                  </View>
                </Stack>
              </Stack>
              <Stack direction="vertical">
                <Typography.Text size="caption1" color="neutralBase-60">
                  {t("GoalGetter.GoalSummaryScreen.currentValue")}
                </Typography.Text>
                <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                  {formatCurrency(goal.TotalBalance)}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" gap="4p">
                <Typography.Text size="caption1" color="neutralBase-60">
                  {t("GoalGetter.GoalSummaryScreen.timeAchieved")}
                </Typography.Text>
                <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                  {t("GoalGetter.GoalSummaryScreen.months", {
                    value: goal.TimeLeft,
                  })}{" "}
                  - {goal.TargetDate}
                </Typography.Text>
              </Stack>
              <Pressable style={buttonContainerStyle} onPress={handleOnCollectButtonPress}>
                <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                  {t("GoalGetter.GoalSummaryScreen.viewGoal")}
                </Typography.Text>
              </Pressable>
            </Stack>
          </ImageBackground>
        </Stack>
        <Image source={footerCardImage} style={styles.cardBackgroundImage} />
        <ContentContainer isScrollView>
          <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={ProductDetailTextStyle}>
            {t("GoalGetter.GoalSummaryScreen.productDetails")}
          </Typography.Text>
          <Stack direction="vertical" style={detailsTableContainerStyle}>
            {detailsData.map((item, index) => {
              if (!item.showStatus) {
                return null;
              } else if (index === 0) {
                return (
                  <Stack direction="vertical" key={index} style={[detailsRowStyle, styles.tabelHeaderStyle]}>
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
          <View style={doneButtonContainerStyle}>
            <Button onPress={handleOnEndGoalPress}>{t("GoalGetter.GoalSummaryScreen.endGoal")}</Button>
          </View>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  cardBackground: {
    height: "100%",
    width: "100%",
  },
  cardBackgroundImage: {
    width: "100%",
  },
  circleShapeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleShapeImage: {
    borderRadius: 45,
    height: "100%",
    width: "100%",
  },
  internalHeaderContent: {
    width: "100%",
  },
  tabelHeaderStyle: {
    borderBottomWidth: 1,
  },
});
