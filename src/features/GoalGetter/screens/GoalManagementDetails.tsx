import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { DownloadGoalIcon } from "../assets/icons";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { ProductTypeName } from "../types";
import { SavingPotsType } from "../utils";

export default function GoalManagementDetails() {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.GoalManagementDetails">>();

  const navigation = useNavigation();
  const [isReceiveAlertsOn, setIsReceiveAlertsOn] = useState(false);
  const [arcAlert, setArcAlert] = useState(false);

  const { goalType: type, goal, goalName, goalImage, goalId } = params;

  function onBuyPress() {
    if (type === ProductTypeName.GOLD + "") {
      navigation.navigate("GoalGetter.BuyGoldScreen");
    } else if (type === ProductTypeName.MUTUAL_FUND + "") {
      navigation.navigate("GoalGetter.MutualFundsActionScreen");
    }
  }
  function onSellPress() {
    if (type === ProductTypeName.GOLD + "") {
      navigation.navigate("GoalGetter.SellGoldScreen");
    } else if (type === ProductTypeName.MUTUAL_FUND + "") {
      setArcAlert(true);
    }
  }
  function onSavingPotWithDrawPress() {
    if (type === ProductTypeName.SAVING_POT) {
      navigation.navigate("GoalGetter.SavingPotActionScreen", {
        savingPotType: SavingPotsType.WITHDRAW,
        fromBalanceAmount: 2400,
        toBalanceAmount: 30000,
        goalId,
      });
    }
  }
  function onSavingPotAddMoneyPress() {
    if (type === ProductTypeName.SAVING_POT) {
      navigation.navigate("GoalGetter.SavingPotActionScreen", {
        savingPotType: SavingPotsType.ADDMONEY,
        fromBalanceAmount: 2401,
        toBalanceAmount: 30000,
      });
    }
  }
  const onEndAndKeepPress = () => {
    navigation.navigate("GoalGetter.GoalDeleteSummaryScreen", {
      goal: goal,
      productType: type,
      goalName,
      goalImage,
      goalId,
    });
  };

  function onAlertPress() {
    setArcAlert(false);
  }

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("Home.DashboardScreen.GoalGetter.goalManagement.title")} />

      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <List>
          <List.Item.Primary
            label={t("GoalGetter.EditGoalGetter.label")}
            helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.editGoal")}
            onPress={() => {
              navigation.navigate("GoalGetter.GoalGetterStack", {
                screen: "GoalGetter.EditGoalScreen",
              });
            }}
            end={<List.End.Chevron />}
            isTextLarge
          />
        </List>
        {type !== ProductTypeName.SAVING_POT ? (
          <>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.sell")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.sellLabel")}
                end={<List.End.Chevron />}
                onPress={() => onSellPress()}
                isTextLarge
              />
            </List>
            <List>
              <List.Item.Primary
                onPress={() => {
                  onBuyPress();
                }}
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.buy")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.buyLabel")}
                end={<List.End.Chevron />}
                isTextLarge
              />
            </List>
          </>
        ) : (
          <>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.withdraw")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.withdrawLabel")}
                onPress={() => onSavingPotWithDrawPress()}
                end={<List.End.Chevron />}
                isTextLarge
              />
            </List>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.addMoney")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.addMoneyLabel")}
                end={<List.End.Chevron />}
                onPress={() => onSavingPotAddMoneyPress()}
                isTextLarge
              />
            </List>
          </>
        )}
        <List>
          <List.Item.Primary
            label={t("Home.DashboardScreen.GoalGetter.goalManagement.endAndKeepProducts")}
            helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.endAndKeepProductsLabel")}
            end={<List.End.Chevron />}
            onPress={() => onEndAndKeepPress()}
            isTextLarge
          />
        </List>
        <List>
          <List.Item.Primary
            label={t("Home.DashboardScreen.GoalGetter.goalManagement.receiveAlert")}
            helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.receiveAlertLabel")}
            end={
              <List.End.Toggle
                value={isReceiveAlertsOn}
                onPress={() => {
                  setIsReceiveAlertsOn(!isReceiveAlertsOn);
                }}
              />
            }
            isTextLarge
          />
        </List>
        {type === ProductTypeName.MUTUAL_FUNDS && (
          <List>
            <List.Item.Primary
              label={t("Home.DashboardScreen.GoalGetter.goalManagement.printStatement")}
              helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.printStatementLabel")}
              end={<DownloadGoalIcon />}
            />
          </List>
        )}
        {arcAlert && (
          <NotificationModal
            variant="warning"
            title={t("Home.DashboardScreen.GoalGetter.goalManagement.sell")}
            message={t("Home.DashboardScreen.GoalGetter.goalManagement.warningARC")}
            isVisible={arcAlert}
            buttons={{
              primary: (
                <Button
                  onPress={() => {
                    onAlertPress();
                  }}>
                  {t("Home.DashboardScreen.GoalGetter.goalManagement.goToARC")}
                </Button>
              ),
            }}
          />
        )}
      </ContentContainer>
    </Page>
  );
}
