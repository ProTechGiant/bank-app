import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { EmptyRequestsIcon } from "../assets/icons";
import { Request } from "../components";
import { IpsTabsEnum, RequestStatusEnum } from "../type";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  //TODO remove this mock data once integrated with backend
  const data: { name: string; date: string; value: number; status: RequestStatusEnum }[] = [
    {
      name: "Mohammed Ali",
      value: 350,
      status: RequestStatusEnum.PENDING,
      date: "July 3, 2023",
    },
    {
      name: "Naveed ahmed",
      value: 350,
      status: RequestStatusEnum.PAID,
      date: "July 3, 2023",
    },
    {
      name: "Khalid ali",
      value: 350,
      status: RequestStatusEnum.REJECTED,
      date: "July 3, 2023",
    },
    {
      name: "Mohammed Ali",
      value: 350,
      status: RequestStatusEnum.CANCELED,
      date: "July 3, 2023",
    },
    {
      name: "Mohammed Ali",
      value: 350,
      status: RequestStatusEnum.EXPIRED,
      date: "July 3, 2023",
    },
  ];
  const isLoading = false;

  const FILTERS = Object.values(RequestStatusEnum);
  const [currentTab, setCurrentTab] = useState<IpsTabsEnum>(IpsTabsEnum.SENT);
  const [currentFilter, setCurrentFilter] = useState<RequestStatusEnum>(RequestStatusEnum.ALL);

  const handleOnRequestPress = () => {
    //TODO
  };

  const handleOnCreateRequestPress = () => {
    navigation.navigate("Ips.IpsStack", { screen: "IpsStack.CreateRequest" });
  };

  const statusBarColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    alignSelf: "center",
  }));
  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: 0,
    position: "absolute",
    width: "100%",
    padding: theme.spacing["20p"],
  }));

  return (
    <Page insets={["left", "right", "bottom", "top"]} backgroundColor="neutralBase-60">
      <StatusBar barStyle="light-content" backgroundColor={statusBarColor} translucent />
      <NavHeader title={t("Ips.HubScreen.title")} onBackPress={() => navigation.goBack()} />
      {isLoading ? (
        <ActivityIndicator />
      ) : data.length === 0 ? (
        <Stack
          direction="vertical"
          gap="16p"
          align="center"
          justify="center"
          flex={1}
          style={styles.emptyRequestsStack}>
          <EmptyRequestsIcon />
          <Typography.Text weight="bold" size="title3" align="center">
            {t("Ips.HubScreen.emptyTitle")}
          </Typography.Text>
          <Typography.Text color="neutralBase+10" size="callout" align="center">
            {t("Ips.HubScreen.emptySubtitle")}
          </Typography.Text>
        </Stack>
      ) : (
        <>
          <Stack direction="vertical" gap="24p" style={contentContainerStyle}>
            <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab} style={segmentedControlStyle}>
              <SegmentedControl.Item value={IpsTabsEnum.SENT}>
                {`${t("Ips.HubScreen.sent")} ${t("Ips.HubScreen.requests")}`}
              </SegmentedControl.Item>
              <SegmentedControl.Item value={IpsTabsEnum.RECEIVED}>{`${t("Ips.HubScreen.received")} ${t(
                "Ips.HubScreen.requests"
              )}`}</SegmentedControl.Item>
            </SegmentedControl>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <Stack direction="horizontal" gap="8p">
                {FILTERS.map(filter => (
                  <Chip
                    isDark={currentFilter === filter}
                    title={t(`Ips.HubScreen.${filter}`)}
                    isRemovable={false}
                    isSelected={currentFilter === filter}
                    onPress={() => setCurrentFilter(filter)}
                  />
                ))}
              </Stack>
            </ScrollView>
            <Typography.Text size="title3" weight="medium">
              {currentFilter === RequestStatusEnum.ALL
                ? `${t(`Ips.HubScreen.${currentFilter}`)} ${t(`Ips.HubScreen.${currentTab}`)}`
                : t(`Ips.HubScreen.${currentFilter}`)}{" "}
              {t(`Ips.HubScreen.requests`)}
            </Typography.Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.fullDimensions}>
              {data.map((item, index) => (
                <Request
                  key={index}
                  username={item.name}
                  date={item.date}
                  value={item.value}
                  status={item.status}
                  onPress={handleOnRequestPress}
                />
              ))}
            </ScrollView>
          </Stack>
          <View style={buttonContainerStyle}>
            <Button onPress={handleOnCreateRequestPress}>
              <Typography.Text color="neutralBase-60">{t(`Ips.HubScreen.button`)}</Typography.Text>
            </Button>
          </View>
        </>
      )}
    </Page>
  );
}
const styles = StyleSheet.create({
  emptyRequestsStack: {
    alignSelf: "center",
    height: "100%",
    width: "80%",
  },
  fullDimensions: {
    height: "60%",
    marginBottom: 120,
    width: "100%",
  },
});
