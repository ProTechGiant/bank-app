import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PendingRequest } from "../components";

export default function ReceivedRequestsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  //TODO remove these data with real API
  const receivedRequests = [
    { name: "Mohamed Ali", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "M Bashir Ali", amount: 450, creationDate: new Date() },
    { name: "Shakeel Amjad", amount: 450, creationDate: new Date() },
    { name: "Abu Ubaid", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
    { name: "Naveed Ahmed", amount: 450, creationDate: new Date() },
  ];

  const [selectedRequest, setSelectedRequest] = useState<number>(-1);
  const [isRejectRequestModalVisible, setIsRejectRequestModalVisible] = useState<boolean>(false);

  const isSelectedRequest = selectedRequest !== -1;
  const handleOnPayPress = () => {
    //TODO
  };
  const handleOnRemindMeLaterPress = () => {
    navigation.navigate("Ips.IpsStack", { screen: "IpsStack.HubScreen" });
  };
  const handleOnRejectPress = () => {
    setIsRejectRequestModalVisible(true);
  };
  const handleOnRejectYesPress = () => {
    //TODO
  };

  const subtitleStyle = useThemeStyles<TextStyle>(theme => ({ padding: theme.spacing["20p"] }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-60"],
    padding: theme.spacing["20p"],
  }));
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("Ips.ReceivedRequestsScreen.title")} />
      <Stack direction="vertical">
        <Typography.Header size="large" weight="medium" style={subtitleStyle}>
          {t("Ips.ReceivedRequestsScreen.subtitle")}
        </Typography.Header>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.requests}>
          {receivedRequests.map((r, index) => (
            <PendingRequest
              name={r.name}
              amount={r.amount}
              date={r.creationDate.toDateString()}
              isSelected={selectedRequest === index}
              setSelected={() => setSelectedRequest(index)}
            />
          ))}
        </ScrollView>
        <Stack direction="vertical" align="stretch" gap="8p" style={buttonsContainerStyle}>
          <Button disabled={!isSelectedRequest} onPress={handleOnPayPress}>
            <Typography.Text color={!isSelectedRequest ? "neutralBase+30" : "neutralBase-60"}>
              {t("Ips.ReceivedRequestsScreen.pay")}
            </Typography.Text>
          </Button>
          <Button variant="secondary" onPress={handleOnRemindMeLaterPress}>
            <Typography.Text>{t("Ips.ReceivedRequestsScreen.remindMeLater")}</Typography.Text>
          </Button>
          <Button variant="tertiary" onPress={handleOnRejectPress}>
            <Typography.Text color={!isSelectedRequest ? "neutralBase" : "neutralBase+30"}>
              {t("Ips.ReceivedRequestsScreen.reject")}
            </Typography.Text>
          </Button>
        </Stack>
      </Stack>
      <NotificationModal
        isVisible={isRejectRequestModalVisible}
        title={t("Ips.ReceivedRequestsScreen.rejectTitle")}
        variant="error"
        message={t("Ips.ReceivedRequestsScreen.rejectSubtitle")}
        buttons={{
          primary: (
            <Button onPress={handleOnRejectYesPress}>
              <Typography.Text color="neutralBase-60">{t("Ips.ReceivedRequestsScreen.yes")}</Typography.Text>
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsRejectRequestModalVisible(false)}>
              <Typography.Text>{t("Ips.ReceivedRequestsScreen.no")}</Typography.Text>
            </Button>
          ),
        }}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  requests: {
    height: "60%",
    width: "100%",
  },
});
