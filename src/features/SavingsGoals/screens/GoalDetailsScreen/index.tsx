import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/MainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function GoalDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.GoalDetailsScreen">>();
  const { PotId, amountWithdrawn } = route.params;
  const fundGoalModalShown = useRef(false);
  const [showAmountWithdrawn, setShowAmountWithdrawn] = useState(amountWithdrawn);

  // Immediately funding goal modal if needed
  useFocusEffect(
    useCallback(() => {
      if (true === route.params.redirectToFundingModal && !fundGoalModalShown.current) {
        navigation.navigate("SavingsGoals.FundGoalModal", {
          PotId: route.params.PotId,
          isFirstFunding: true,
        });

        // or else it'll be shown every time
        fundGoalModalShown.current = true;
      }

      // this is needed so the amount is still visibile in the modal when the modal is closed
      if (amountWithdrawn) {
        setShowAmountWithdrawn(amountWithdrawn);
      }
    }, [route.params])
  );

  const handleOnBackPress = () => {
    if (route.params.redirectToFundingModal) navigation.navigate("SavingsGoals.ListGoalsScreen");
    else navigation.goBack();
  };

  const handleOnOpenFunding = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId: PotId,
    });
  };

  const handleOnOpenWithdraw = () => {
    navigation.navigate("SavingsGoals.WithdrawGoalModal", {
      PotId: PotId,
    });
  };

  const handleOnCloseWithdrawConfirmationModal = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      PotId: PotId,
      amountWithdrawn: undefined,
    });
  };

  const buttonsContainer = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing["16p"],
    }),
    []
  );

  return (
    <Page>
      <NavHeader onBackPress={handleOnBackPress} title="Goal details screen" />
      <ContentContainer>
        <View style={buttonsContainer}>
          <Button onPress={handleOnOpenFunding}>Open funding modal</Button>
        </View>
        <Button onPress={handleOnOpenWithdraw}>Open withdraw modal</Button>
        <NotificationModal
          variant="success"
          onClose={handleOnCloseWithdrawConfirmationModal}
          message={t("SavingsGoals.WithdrawModal.successfulWithdrawal.text")}
          title={t("SavingsGoals.WithdrawModal.successfulWithdrawal.title", {
            amount: showAmountWithdrawn,
          })}
          isVisible={amountWithdrawn !== undefined}
        />
      </ContentContainer>
    </Page>
  );
}
