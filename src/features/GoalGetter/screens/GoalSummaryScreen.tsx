import { useTranslation } from "react-i18next";
import { Image, ImageBackground, Platform, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ThreeDotsVerticalIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import cardBackgroundImage from "../assets/card-background-image.png";
import footerCardImage from "../assets/footer-card-image.png";
import BackgroundImage from "../assets/summary-header-Image.png";

export default function GoalSummaryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const detailsData = [
    {
      label: t("GoalGetter.GoalSummaryScreen.product"),
      value: "Saving pot",
    },
    {
      label: t("GoalGetter.GoalSummaryScreen.investedAmount"),
      value: "50,400.00 SAR",
    },
    {
      label: t("GoalGetter.GoalSummaryScreen.totalValue"),
      value: "50,400.00 SAR",
    },
  ];

  const handleOnHeaderIconPress = () => {
    // TODO will be nagigate when the next screen created
  };

  const handleOnCollectButtonPress = () => {
    // TODO will be nagigate when the next screen created
  };

  const handleOnCollectPress = () => {
    navigation.navigate("GoalGetter.CollectSummaryScreen");
  };

  const balanceCardContainer = useThemeStyles<ViewStyle>(() => ({
    position: "relative",
    height: Platform.OS === "android" ? 353 : 353 + insets.top,
  }));

  const headerCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 2,
    borderColor: "#fff", // TODO doesnot exist in theme
    borderRadius: theme.radii.xlarge, // TODO doesnot exist in theme
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const detailsRowStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  const detailsTableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    margin: theme.spacing["20p"],
    borderRadius: theme.radii.small,
  }));

  const ProductDetailTextStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    marginHorizontal: theme.spacing["20p"],
  }));

  const doneButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["64p"],
  }));

  const darkCircleShapeStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 110,
    width: 110,
    borderWidth: 7,
    backgroundColor: theme.palette.neutralBase,
    borderColor: theme.palette.neutralBase,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  }));

  const internalCircleShapeStyle = useThemeStyles<ViewStyle>(_theme => ({
    height: 89,
    width: 89,
    borderWidth: 7,
    backgroundColor: "#FFF", // TODO doesnot exist in theme
    borderColor: "#FFF", // TODO doesnot exist in theme
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  }));

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      <ScrollView>
        <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
          <ImageBackground source={BackgroundImage} style={styles.cardBackground} resizeMode="cover">
            {/* TODO title will replace actuall data once integrate with api */}
            <NavHeader
              title="Rainy Day"
              variant="white"
              end={<NavHeader.IconEndButton icon={<ThreeDotsVerticalIcon />} onPress={handleOnHeaderIconPress} />}
            />
            <SafeAreaView edges={["top"]}>
              <Stack direction="vertical" style={headerCardContainerStyle} gap="16p">
                <Stack direction="horizontal" justify="space-between" align="center" style={{ width: "100%" }}>
                  <Stack direction="vertical">
                    <Typography.Text size="footnote" color="neutralBase-60">
                      {t("GoalGetter.GoalSummaryScreen.targetGoal")}
                    </Typography.Text>
                    <Typography.Text size="xlarge" weight="bold" color="neutralBase-60">
                      {/* TODO will replace actuall data once integrate with api */}
                      50,400 SR
                    </Typography.Text>
                  </Stack>
                  <Stack direction="horizontal" justify="center" align="center" style={styles.circleShapeContainer}>
                    <View style={darkCircleShapeStyle}>
                      <View style={internalCircleShapeStyle}>
                        <Image source={cardBackgroundImage} style={styles.circleShapeImage} />
                      </View>
                    </View>
                  </Stack>
                </Stack>
                <Stack direction="vertical">
                  <Typography.Text size="caption1" color="neutralBase-60">
                    {t("GoalGetter.GoalSummaryScreen.currentValue")}
                  </Typography.Text>
                  <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                    {/* TODO will replace actuall data once integrate with api */}
                    50,400.00 SR
                  </Typography.Text>
                </Stack>
                <Stack direction="vertical" gap="8p">
                  <Typography.Text size="caption1" color="neutralBase-60">
                    {t("GoalGetter.GoalSummaryScreen.timeAchieved")}
                  </Typography.Text>
                  <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                    {/* TODO will replace actuall data once integrate with api */}8 months - 01 May 2023
                  </Typography.Text>
                </Stack>
                <Pressable style={buttonContainerStyle} onPress={handleOnCollectButtonPress}>
                  <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                    {t("GoalGetter.GoalSummaryScreen.viewGoal")}
                  </Typography.Text>
                </Pressable>
              </Stack>
            </SafeAreaView>
          </ImageBackground>
        </Stack>
        <Image source={footerCardImage} style={styles.cardBackgroundImage} />
        <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={ProductDetailTextStyle}>
          {t("GoalGetter.GoalSummaryScreen.productDetails")}
        </Typography.Text>
        <Stack direction="vertical" style={detailsTableContainerStyle}>
          {detailsData.map((item, index) => {
            if (index === 0) {
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
          <Button onPress={handleOnCollectPress}>{t("GoalGetter.GoalSummaryScreen.collect")}</Button>
        </View>
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
  tabelHeaderStyle: {
    borderBottomWidth: 1,
  },
});
