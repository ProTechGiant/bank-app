import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import {
  AliasManagementIcon,
  InternalTransferIcon,
  QuickTransferIcon,
  SadadBillPaymentIcon,
  TransferHorizontalIcon,
  TransferInfoIcon,
} from "@/assets/icons";
import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PaymentOption } from "../components";

interface Styles {
  contentStyle: {
    paddingTop: number;
    paddingHorizontal: number;
  };
  titleSection: {
    paddingBottom: number;
  };
  headerSpacing: {
    paddingTop: number;
  };
}

export default function TransferSettingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnAliasManagementPress = () => {
    navigation.navigate("ProxyAlias.ProxyAliasStack", {
      screen: "ProxyAlias.AliasManagementScreen",
    });
  };

  const styles = useThemeStyles<Styles>(
    theme =>
      ({
        contentStyle: {
          paddingTop: theme.spacing["24p"],
          paddingHorizontal: theme.spacing["20p"],
        },
        titleSection: {
          paddingBottom: theme.spacing["24p"],
        },
        headerSpacing: {
          paddingTop: theme.spacing["20p"],
        },
      } as Styles)
  );

  type InternalTransfersStackParams = {
    screen: "InternalTransfers.TransferPaymentScreen";
    params: { transferType: string };
  };

  const handleOnTransferPayment = (transferType: string) => {
    const params: InternalTransfersStackParams = {
      screen: "InternalTransfers.TransferPaymentScreen",
      params: {
        transferType,
      },
    };
    navigation.navigate("InternalTransfers.InternalTransfersStack", params);
  };

  const paymentOptions = [
    {
      onPress: () => handleOnTransferPayment("internalTransfer"),
      icon: <InternalTransferIcon />,
      title: t("InternalTransfers.PaymentsHubScreen.options.internalTransfer.title"),
      helperText: t("InternalTransfers.PaymentsHubScreen.options.internalTransfer.helperText"),
      testID: "InternalTransfers.PaymentsHubScreen:InternalTransferButton",
    },
    {
      onPress: () => handleOnTransferPayment("LOCAL"),
      icon: <TransferHorizontalIcon />,
      title: t("InternalTransfers.PaymentsHubScreen.options.localTransfer.title"),
      helperText: t("InternalTransfers.PaymentsHubScreen.options.localTransfer.helperText"),
      testID: "InternalTransfers.PaymentsHubScreen:LocalTransferButton",
    },
    {
      onPress: () => handleOnTransferPayment("SADAD"),
      icon: <SadadBillPaymentIcon />,
      title: t("InternalTransfers.PaymentsHubScreen.options.sadadbillpayment.title"),
      helperText: t("InternalTransfers.PaymentsHubScreen.options.sadadbillpayment.helperText"),
      testID: "InternalTransfers.PaymentsHubScreen:SadadBillButton",
    },
    {
      onPress: () => handleOnTransferPayment("ALIAS"),
      icon: <QuickTransferIcon />,
      title: t("InternalTransfers.PaymentsHubScreen.options.quickTransfer.title"),
      helperText: t("InternalTransfers.PaymentsHubScreen.options.quickTransfer.helperText"),
      testID: "InternalTransfers.PaymentsHubScreen:QuickTransferButton",
    },
    {
      onPress: handleOnAliasManagementPress,
      icon: <AliasManagementIcon />,
      title: t("InternalTransfers.PaymentsHubScreen.options.aliasManagment.title"),
      helperText: t("InternalTransfers.PaymentsHubScreen.options.aliasManagment.helperText"),
      testID: "InternalTransfers.PaymentsHubScreen:AliasManagementButton",
    },
  ];

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <View style={styles.headerSpacing} />
        <NavHeader testID="InternalTransfers.TransferSettingScreen:NavHeader" />
        <ScrollView contentContainerStyle={styles.contentStyle}>
          <View style={styles.titleSection}>
            <Typography.Text color="neutralBase+30" size="title1" weight="medium">
              {t("InternalTransfers.TransferSettings.navTitle")} <TransferInfoIcon />
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="regular">
              {t("InternalTransfers.TransferSettings.description")}
            </Typography.Text>
          </View>
          <Stack direction="vertical" gap="32p" align="stretch">
            {paymentOptions.map((option, index) => (
              <PaymentOption key={index} {...option} />
            ))}
          </Stack>
        </ScrollView>
        <NotificationModal
          variant="error"
          title={t("errors.generic.somethingWentWrong")}
          message={t("errors.generic.tryAgainLater")}
          isVisible={isErrorModalVisible}
          onClose={() => setIsErrorModalVisible(false)}
        />
      </Page>
    </>
  );
}
