import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { PaymentHistoryIcon, PlusIcon, SadadBillPaymentIcon, TransferHorizontalIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BillItemCard, EmptyDataWarningCard, QuickActionItem } from "../components";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useDueBills, useSavedBills } from "../hooks/query-hooks";
import { BillItem } from "../types";

export default function BillPaymentHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: dueBills, refetch: dueBillsRefetch } = useDueBills();
  const { data: savedBills, refetch: savedBillsRefetch } = useSavedBills();

  const {
    setNavigationType,
    clearContext,
    billDetails: { Description },
  } = useSadadBillPaymentContext();

  const [currentTab, setCurrentTab] = useState<"paymentDue" | "savedBills">("paymentDue");

  useEffect(() => {
    if (currentTab === "paymentDue") {
      dueBillsRefetch();
    }
    if (currentTab === "savedBills") {
      savedBillsRefetch();
    }
  }, [currentTab, Description]);

  const handleOnAddBillPress = () => {
    clearContext();
    setNavigationType("saveBill");
    navigation.navigate("SadadBillPayments.SelectBillerCategoryScreen");
  };

  const handleOnOneTimePaymentPress = () => {
    clearContext();
    setNavigationType("oneTimePayment");
    navigation.navigate("SadadBillPayments.SelectBillerCategoryScreen");
  };

  const handleOnSplitPaymentPress = () => {
    //TODO - To be implemented as part of the upcoming story
  };

  const handleOnOnePaymentHistoryPress = () => {
    navigation.navigate("SadadBillPayments.BillPaymentHistoryScreen");
  };

  const handleOnViewAllPress = () => {
    clearContext();
    navigation.navigate("SadadBillPayments.SaveBillsScreen", {
      navigationFlow: currentTab,
    });
  };

  const handleOnBillItemPress = (item: BillItem) => {
    if (currentTab === "paymentDue") {
      setNavigationType("payBill");
      navigation.navigate("SadadBillPayments.BillDetailsScreen", {
        AccountNumber: item.AccountNumber,
        billerId: item.BillerId,
      });
    } else if (currentTab === "savedBills") {
      navigation.navigate("SadadBillPayments.BillDetailsScreen", {
        AccountNumber: item.AccountNumber,
        billerId: item.BillerId,
      });
    }
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

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <NavHeader variant="angled">
        <NavHeader.BoldTitle>{t("SadadBillPayments.BillPaymentHomeScreen.navHeaderTitle")}</NavHeader.BoldTitle>
      </NavHeader>
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
                <SegmentedControl.Item value="paymentDue">
                  {t("SadadBillPayments.BillPaymentHomeScreen.tabItems.paymentDue")}
                </SegmentedControl.Item>
                <SegmentedControl.Item value="savedBills">
                  {t("SadadBillPayments.BillPaymentHomeScreen.tabItems.savedBills")}
                </SegmentedControl.Item>
              </SegmentedControl>
            </View>
          </Stack>
          <Stack direction="vertical" gap="20p" align="stretch">
            {(savedBills?.length > 5 && currentTab === "savedBills") ||
            (dueBills?.length > 5 && currentTab === "paymentDue") ? (
              <Pressable style={viewAllStyle} onPress={handleOnViewAllPress}>
                <Typography.Text color="primaryBase-30" size="footnote" weight="semiBold">
                  {t("SadadBillPayments.BillPaymentHomeScreen.viewAll")}
                </Typography.Text>
              </Pressable>
            ) : null}

            {savedBills?.length > 0 && currentTab === "savedBills" ? (
              savedBills
                ?.slice(0, 5)
                .map(item => (
                  <BillItemCard key={item.BillNumber} data={item} onPress={() => handleOnBillItemPress(item)} />
                ))
            ) : dueBills?.length > 0 && currentTab === "paymentDue" ? (
              dueBills
                ?.slice(0, 5)
                .map(item => (
                  <BillItemCard key={item.BillNumber} data={item} onPress={() => handleOnBillItemPress(item)} />
                ))
            ) : (
              <EmptyDataWarningCard
                title={
                  currentTab === "paymentDue"
                    ? t("SadadBillPayments.BillPaymentHomeScreen.noDueTitle")
                    : t("SadadBillPayments.BillPaymentHomeScreen.noBillTitle")
                }
                description={
                  currentTab === "paymentDue"
                    ? t("SadadBillPayments.BillPaymentHomeScreen.noDueDescription")
                    : t("SadadBillPayments.BillPaymentHomeScreen.noBillDescription")
                }
                onPress={handleOnAddBillPress}
              />
            )}
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
