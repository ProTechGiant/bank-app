import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BankAccountIcon,
  InfoCircleIcon,
  LocalTransferIcon,
  SearchIcon,
  SettingsIcon,
  TransferHorizontalIcon,
} from "@/assets/icons";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PaymentOption } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";

const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });

function PaymentsHub() {
  const { setInternalTransferEntryPoint } = useInternalTransferContext();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const account = useAccount();

  const handleInternalTransferPress = () => {
    setInternalTransferEntryPoint("payment-hub");
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const headerBackground = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
  }));

  const headerContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    paddingTop: theme.spacing["32p"],
  }));

  const mockCardStyle = useThemeStyles<ViewStyle>(theme => ({
    // TODO: temporary card to be replace with small svg or mini card component
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: 1,
    height: 34,
    width: 55,
  }));

  const searchContainer = useThemeStyles<ViewStyle>(theme => ({
    // TODO: Temp background color as it's not found in core theme and design is not finished
    backgroundColor: "rgba(242, 242, 242, 0.2)",
    padding: theme.spacing["8p"],
    borderRadius: 40,
  }));

  const searchIconColor = useThemeStyles(theme => theme.palette["neutralBase-50"]);

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={headerBackground}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <Stack direction="vertical" gap="32p" style={headerContainer}>
            <Typography.Text size="large" weight="bold" color="neutralBase-50">
              {t("InternalTransfers.PaymentHub.title")}
            </Typography.Text>

            <Stack direction="horizontal" gap="12p" align="center" justify="space-between">
              {account.data !== undefined ? (
                <>
                  {/* Card mock */}
                  <View style={mockCardStyle} />
                  <Stack direction="vertical" style={styles.expandText}>
                    {/* TODO: replace mock account info */}
                    <Typography.Text color="neutralBase-50" size="callout">
                      {account.data.currentAccountName}
                    </Typography.Text>
                    <Typography.Text color="neutralBase" size="footnote">
                      {formatter.format(account.data?.currentAccountBalance ?? 0)} SAR available
                    </Typography.Text>
                  </Stack>
                </>
              ) : null}
              {/* TODO: not working on search functionality yet */}
              <Pressable style={searchContainer}>
                <SearchIcon color={searchIconColor} />
              </Pressable>
            </Stack>
          </Stack>
        </SafeAreaView>
      </View>
      <ScrollView contentContainerStyle={contentStyle}>
        <Stack direction="vertical" gap="32p" align="stretch">
          <PaymentOption
            // TODO: add navigation to Local Transfer
            onPress={() => Alert.alert("Local Transfer is pressed")}
            icon={<LocalTransferIcon />}
            title={t("InternalTransfers.PaymentHub.options.localTransfer.title")}
            helperText={t("InternalTransfers.PaymentHub.options.localTransfer.helperText")}
          />
          <PaymentOption
            onPress={handleInternalTransferPress}
            icon={<TransferHorizontalIcon />}
            title={t("InternalTransfers.PaymentHub.options.internalTransfer.title")}
            helperText={t("InternalTransfers.PaymentHub.options.internalTransfer.helperText")}
          />
        </Stack>
      </ScrollView>
    </Page>
  );
}

function MockHomeComponent() {
  return (
    <SafeAreaView>
      <Typography.Text>Home</Typography.Text>
    </SafeAreaView>
  );
}
function MockSettingsComponent() {
  return (
    <SafeAreaView>
      <Typography.Text>Settings</Typography.Text>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

// TODO: move tab navigation once homepage is completed
export default function PaymentsHubScreen() {
  const getNavigationIcon = (color: string, routeName: string) => {
    if (routeName === "Home") {
      return <BankAccountIcon color={color} />;
    } else if (routeName === "Payments") {
      return <TransferHorizontalIcon color={color} />;
    } else if (routeName === "Settings") {
      return <SettingsIcon color={color} />;
    }

    return <InfoCircleIcon color={color} />;
  };
  const activeIconColor = useThemeStyles(theme => theme.palette.primaryBase);
  const inActiveIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => getNavigationIcon(color, route.name),
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inActiveIconColor,
      })}>
      <Tab.Screen name="Home" component={MockHomeComponent} />
      <Tab.Screen name="Payments" component={PaymentsHub} />
      <Tab.Screen name="Settings" component={MockSettingsComponent} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
});
