import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PaymentHistoryIcon, PlusIcon, SadadBillPaymentIcon, TransferHorizontalIcon } from "@/assets/icons";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  BillItemCard,
  ContentContainer,
  EmptyDataWarningCard,
  NavHeader,
  Page,
  QuickActionItem,
  SegmentedControl,
  Stack,
  Typography,
} from "../components";
import { MockBillDetails } from "../mocks/MockBillDetails";

export default function BillPaymentHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const numberOfBills = MockBillDetails.length;
  //TODO MockBillDetails should be replaced with an API call.

  const [currentTab, setCurrentTab] = useState<"due" | "bills">("due");

  const handleOnAddBillPress = () => {
    navigation.navigate("SadadBillPayments.SelectBillerCategoryScreen");
  };

  const handleOnOneTimePaymentPress = () => {
    //TODO - To be implemented as part of the upcoming story
  };

  const handleOnSplitPaymentPress = () => {
    //TODO - To be implemented as part of the upcoming story
  };

  const handleOnOnePaymentHistoryPress = () => {
    //TODO - To be implemented as part of the upcoming story
  };

  const handleOnViewAllPress = () => {
    //TODO - To be implemented as part of the upcoming story
  };

  const handleOnBiilItemPress = () => {
    //TODO - To be implemented as part of the upcoming story
    navigation.navigate("SadadBillPayments.BillDetailsScreen");
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["64p"],
  }));

  const addIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 100,
  }));

  const addBillStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["8p"],
  }));

  const QuickActionItemContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
  }));

  const viewAllStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
    alignSelf: "flex-end",
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    zIndex: 1,
    paddingTop: theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
        <SafeAreaView style={headerStyle}>
          <NavHeader variant="angled" title={t("SadadBillPayments.BillPaymentHomeScreen.navHeaderTitle")} />
        </SafeAreaView>

        <ContentContainer isScrollView style={contentContainerStyle}>
          <Stack direction="vertical" gap="16p" align="stretch">
            <Stack align="center" direction="horizontal" gap="12p">
              <Pressable onPress={handleOnAddBillPress} style={addIconContainer}>
                <PlusIcon color={iconColor} />
              </Pressable>
              <Stack align="baseline" direction="vertical" gap="4p">
                <Typography.Text size="callout" weight="semiBold" color="neutralBase+30">
                  {t("SadadBillPayments.BillPaymentHomeScreen.addBillText")}
                </Typography.Text>
                <Typography.Text
                  numberOfLines={3}
                  lineBreakMode="clip"
                  style={addBillStyle}
                  size="caption1"
                  weight="regular"
                  color="neutralBase">
                  {t("SadadBillPayments.BillPaymentHomeScreen.addBillMessage")}
                </Typography.Text>
              </Stack>
            </Stack>
            <Stack direction="horizontal" style={QuickActionItemContainer} justify="center" align="center" gap="20p">
              <QuickActionItem
                title={t("SadadBillPayments.BillPaymentHomeScreen.quickActionItems.oneTimePayment")}
                icon={<TransferHorizontalIcon />}
                onPress={handleOnOneTimePaymentPress}
              />
              <QuickActionItem
                title={t("SadadBillPayments.BillPaymentHomeScreen.quickActionItems.splitBills")}
                icon={<SadadBillPaymentIcon />}
                onPress={handleOnSplitPaymentPress}
              />
              <QuickActionItem
                title={t("SadadBillPayments.BillPaymentHomeScreen.quickActionItems.paymentHistory")}
                icon={<PaymentHistoryIcon />}
                onPress={handleOnOnePaymentHistoryPress}
              />
            </Stack>
            <Stack direction="horizontal">
              <View style={segmentedControlStyle}>
                <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab}>
                  <SegmentedControl.Item value="due">
                    {t("SadadBillPayments.BillPaymentHomeScreen.tabItems.paymentDue")}
                  </SegmentedControl.Item>
                  <SegmentedControl.Item value="bills">
                    {t("SadadBillPayments.BillPaymentHomeScreen.tabItems.savedBills")}
                  </SegmentedControl.Item>
                </SegmentedControl>
              </View>
            </Stack>
            <Stack direction="vertical" gap="20p" align="stretch">
              {numberOfBills > 5 ? (
                <Pressable style={viewAllStyle} onPress={handleOnViewAllPress}>
                  <Typography.Text color="primaryBase-30" size="footnote" weight="semiBold">
                    {t("SadadBillPayments.BillPaymentHomeScreen.viewAll")}
                  </Typography.Text>
                </Pressable>
              ) : null}
              <View>
                {numberOfBills > 0 ? (
                  MockBillDetails.slice(0, 5).map(element => (
                    <BillItemCard key={element.key} data={element} onPress={() => handleOnBiilItemPress()} />
                  ))
                ) : (
                  <EmptyDataWarningCard
                    title={
                      currentTab === "due"
                        ? t("SadadBillPayments.BillPaymentHomeScreen.noDueTitle")
                        : t("SadadBillPayments.BillPaymentHomeScreen.noBillTitle")
                    }
                    description={
                      currentTab === "due"
                        ? t("SadadBillPayments.BillPaymentHomeScreen.noDueDescription")
                        : t("SadadBillPayments.BillPaymentHomeScreen.noBillDescription")
                    }
                    onPress={handleOnAddBillPress}
                  />
                )}
              </View>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
