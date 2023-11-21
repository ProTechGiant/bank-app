import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { DownloadGoalIcon } from "../assets/icons";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { GoalDetailsType } from "../utils";

export default function GoalManagementDetails() {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.GoalManagementDetails">>();

  const navigation = useNavigation();

  const [isReceiveAlertsOn, setIsReceiveAlertsOn] = useState(false);
  const type = params.goalType;

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
                screen: "GoalGetter.EditGoalGetter",
              });
            }}
            end={<List.End.Chevron />}
          />
        </List>
        {type !== GoalDetailsType.SAVING_POTS ? (
          <>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.sell")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.sellLabel")}
                end={<List.End.Chevron />}
              />
            </List>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.buy")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.buyLabel")}
                end={<List.End.Chevron />}
              />
            </List>
          </>
        ) : (
          <>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.withdraw")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.withdrawLabel")}
                end={<List.End.Chevron />}
              />
            </List>
            <List>
              <List.Item.Primary
                label={t("Home.DashboardScreen.GoalGetter.goalManagement.addMoney")}
                helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.addMoneyLabel")}
                end={<List.End.Chevron />}
              />
            </List>
          </>
        )}
        <List>
          <List.Item.Primary
            label={t("Home.DashboardScreen.GoalGetter.goalManagement.endAndKeepProducts")}
            helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.endAndKeepProductsLabel")}
            end={<List.End.Chevron />}
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
          />
        </List>
        {type === GoalDetailsType.MUTUAL_FUNDS && (
          <List>
            <List.Item.Primary
              label={t("Home.DashboardScreen.GoalGetter.goalManagement.printStatement")}
              helperText={t("Home.DashboardScreen.GoalGetter.goalManagement.printStatementLabel")}
              end={<DownloadGoalIcon />}
            />
          </List>
        )}
      </ContentContainer>
    </Page>
  );
}
