import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Typography } from "@/components";
import Button from "@/components/Button";
import { Carousel } from "@/components/Carousel";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Card, MoreFeatureModal } from "../components";
import { cardData } from "../mocks";

export default function SelectCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showMoreFeaturesModal, setShowMoreFeaturesModal] = React.useState(false);

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["20p"],
  }));

  const pressableStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginBottom: theme.spacing["16p"],
  }));

  const buttonsViewContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["20p"],
  }));
  const onApplyPress = () => {
    navigation.navigate("AllInOneCard.ChooseRedemptionMethod");
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: 70,
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page>
      <StatusBar barStyle="dark-content" backgroundColor="#2E2A34" translucent />
      <View style={styles.container}>
        <View style={styles.header}>
          <NavHeader title="All in One" variant="white" />
          <View style={textContainerStyle}>
            <Typography.Header size="medium" weight="bold" align="center" color="neutralBase-60">
              {t("AllInOneCard.SelectedCardScreen.pickedCard")}
            </Typography.Header>
          </View>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            width={326}
            data={cardData}
            Slide={data => <Card data={data.data} />}
            onChangeIndex={setActiveIndex}
            contentContainerStyle={contentContainerStyle}
          />
        </View>
        <View style={buttonsViewContainerStyle}>
          <Pressable
            onPress={() => setShowMoreFeaturesModal(true)}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, pressableStyle]}>
            <Typography.Text size="body" weight="medium" color="successBase">
              {t("AllInOneCard.SelectedCardScreen.showButton")}
            </Typography.Text>
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <ChevronRightIcon color="#00AC86" />
            </View>
          </Pressable>
          <Button onPress={onApplyPress}>{t("AllInOneCard.SelectedCardScreen.apply")}</Button>
        </View>
        <MoreFeatureModal
          isVisible={showMoreFeaturesModal}
          onClose={() => setShowMoreFeaturesModal(false)}
          item={cardData[activeIndex]}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: "absolute",
    top: 130,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  header: {
    backgroundColor: "#2E2A34",
    flex: 0.5,
  },
});
