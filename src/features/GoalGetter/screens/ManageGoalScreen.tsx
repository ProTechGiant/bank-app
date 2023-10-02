import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ButtonSubscribeIcon, GoalRedeemIcon } from "../assets/icons";
import {
  CollapsibleHeader,
  GoalDetails,
  GoalProgressSection,
  LatestTransactionSection,
  PaymentInstructions,
} from "../components";
import { mockGoalDetail } from "../mocks/mockGoalDetail";
import { mockGoalDetailImage } from "../mocks/mockGoalImages";
import { Transaction } from "../types";

export default function ManageGoalScreen() {
  const [selectedImage, setSelectedImage] = useState<string>(mockGoalDetailImage);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "GoalGetter.ManageGoal">>();
  const insets = useSafeAreaInsets();
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);

  const goalDetail = mockGoalDetail;

  const H_MIN_HEIGHT = 52 + insets.top + 8;
  const H_MAX_HEIGHT = 230 + insets.top;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });
  const opacityGoalsTag = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: H_MAX_HEIGHT + theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
  }));

  useEffect(() => {
    if (route.params?.selectedImageURL) {
      setSelectedImage(route.params.selectedImageURL);
    }
  }, [route.params?.selectedImageURL]);

  const handleBackButton = () => {
    navigation.goBack();
  };

  const handleChooseGoalImage = () => {
    // TODO : need to handle edit image
    navigation.goBack();
  };

  const handleEditGoalImage = () => {
    navigation.navigate("GoalGetter.ImageGallary", {
      screen: "GoalGetter.ManageGoal",
    });
  };

  const handleTransactionSeeMore = () => {
    // TODO : handle it
    return;
  };

  const handleGoalEdit = () => {
    navigation.navigate("GoalGetter.EditGoalGetter");
  };

  const handleRedeem = () => {
    // TODO : handle it
    return;
  };

  const handleSubscribe = () => {
    // TODO : handle it
    return;
  };

  const handleGoalDelete = () => {
    //TODO : We still need to actually delete the goal here first by consuming api(not available at this moment).
    setIsDeleteConfirmationVisible(false);
    navigation.goBack();
  };

  return (
    <Page insets={["left", "right", "bottom"]} backgroundColor="neutralBase-60">
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}>
        <View style={contentContainerStyle}>
          <Typography.Text size="title3" weight="bold">
            {goalDetail.Name}
          </Typography.Text>
          <GoalProgressSection
            goalPercentageStatus={Number(goalDetail.GoalPercentageStatus)}
            currentValue={Number(goalDetail.CurrentBalance)}
            totalGoalValue={Number(goalDetail.TargetAmount)}
          />
          <Stack direction="horizontal" justify="space-evenly" gap="8p">
            <View style={styles.buttonContainerStyle}>
              <Button variant="secondary" iconLeft={<GoalRedeemIcon />} onPress={handleRedeem}>
                {t("GoalGetter.goalDetail.buttonRedeem")}
              </Button>
            </View>
            <View style={styles.buttonContainerStyle}>
              <Button variant="primary" iconLeft={<ButtonSubscribeIcon />} onPress={handleSubscribe}>
                {t("GoalGetter.goalDetail.buttonSubscribe")}
              </Button>
            </View>
          </Stack>
          <PaymentInstructions
            minimumContribution={goalDetail.MonthlyContribution}
            currency={t("GoalGetter.goalDetail.sar")}
            upcomingContributionDate={goalDetail.UpcomingContributionDate}
          />
          <GoalDetails
            initialContribution={goalDetail.InitialContribution}
            startDate={goalDetail.StartDate}
            endDate={goalDetail.TargetDate}
            currency={t("GoalGetter.goalDetail.sar")}
          />
          <LatestTransactionSection
            onPressSeeMore={handleTransactionSeeMore}
            transactions={goalDetail.Transactions as Transaction[]}
          />
          <Button variant="secondary" onPress={() => setIsDeleteConfirmationVisible(true)}>
            {t("GoalGetter.goalDetail.buttonDeleteGoal")}
          </Button>
        </View>
      </Animated.ScrollView>

      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button loading={false} disabled={false} onPress={handleGoalDelete}>
              {t("GoalGetter.goalDetail.deleteGoal.buttonDelete")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsDeleteConfirmationVisible(false)}>
              {t("GoalGetter.goalDetail.deleteGoal.cancelButton")}
            </Button>
          ),
        }}
        message={t("GoalGetter.goalDetail.deleteGoal.message")}
        title={t("GoalGetter.goalDetail.deleteGoal.title")}
        isVisible={isDeleteConfirmationVisible}
        onClose={() => setIsDeleteConfirmationVisible(false)}
      />

      <CollapsibleHeader
        backgroundImage={selectedImage}
        scrollHeight={headerScrollHeight}
        onBackPress={handleBackButton}
        onEditImagePress={handleEditGoalImage}
        opacityGoalTag={opacityGoalsTag}
        onGalleryImageChoosePress={handleChooseGoalImage}
        onGoalEdit={handleGoalEdit}
        product={goalDetail.Product}
        productColor={goalDetail.ProductColor}
        productRisk={goalDetail.ProductRisk}
        productRiskColor={goalDetail.ProductRiskColor}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    flex: 1,
  },
});
