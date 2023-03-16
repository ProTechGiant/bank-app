import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";

import { CopyIcon, ErrorOutlineIcon } from "@/assets/icons";
import DismissibleBanner from "@/components/DismissibleBanner";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
import useGetPrimaryAddress from "@/hooks/use-get-primary-address";
import { useThemeStyles } from "@/theme";

import BankDetails from "../../component/BankDetails";
import { BadgeIcon } from "./badge";
import { HistoryIcon } from "./history";

export default function AddMoneyViaBankTransferScreen() {
  const { t } = useTranslation();

  const { data } = useAccount();

  const getPrimaryAddress = useGetPrimaryAddress();

  const [showBanner, setShowBanner] = useState(false);
  const [showErrorCopy, setShowErrorCopy] = useState(false);
  const [dataCopied, setDataCopied] = useState("");

  const handleOnCopyPress = (value: string, label: string) => {
    setDataCopied(label);
    Clipboard.setString(value);
    fetchCopiedText();
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setShowErrorCopy(text !== undefined && text.length < 1);
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
    }, 4000);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    gap: theme.spacing["20p"],
  }));

  const InnerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const noteContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.spacing["8p"],
    flexDirection: "row",
    alignContent: "center",
    padding: theme.spacing["20p"],
    elevation: 2,
    shadowColor: theme.palette["primaryBase-10"],
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  }));

  const bankDetailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.spacing["8p"],
    gap: 1,
    elevation: 2,
    shadowColor: theme.palette["primaryBase-10"],
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  }));

  const historyContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    flexDirection: "row",
    gap: 13.5,
  }));

  const historyContentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
    paddingRight: theme.spacing["32p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const contentBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const badgeIconColor = useThemeStyles<string>(theme => theme.palette.complimentBase);
  const historyIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  const BankDetail = [
    { id: "1", label: `${t("AddMoneyInfo.BankDetails.recipientName")}`, value: data?.currentAccountCustomerFullName },
    { id: "2", label: `${t("AddMoneyInfo.BankDetails.recipientIBAN")}`, value: data?.currentAccountIban },

    { id: "3", label: `${t("AddMoneyInfo.BankDetails.bankName")}`, value: "Croatia Bank Ltd" },
    {
      id: "4",
      label: `${t("AddMoneyInfo.BankDetails.recipientAddress")}`,
      value: `${getPrimaryAddress.data?.AddressLineOne ? getPrimaryAddress.data?.AddressLineOne + ", " : ""}${
        getPrimaryAddress.data?.AddressLineTwo ? getPrimaryAddress.data?.AddressLineTwo + ", " : ""
      }${getPrimaryAddress.data?.District ? getPrimaryAddress.data?.District + ", " : ""}${
        getPrimaryAddress.data?.City ? getPrimaryAddress.data?.City + ", " : ""
      }${getPrimaryAddress.data?.PostalCode ? getPrimaryAddress.data?.PostalCode + ", " : ""}${
        getPrimaryAddress.data?.Country ? getPrimaryAddress.data?.Country : ""
      }`,
    },
  ];

  return (
    <Page backgroundColor="neutralBase-60">
      <DismissibleBanner
        variant={showErrorCopy ? "error" : "default"}
        visible={showBanner}
        message={
          !showErrorCopy
            ? `${dataCopied} ${t("AddMoneyInfo.BankDetails.copyInfo")}`
            : `${t("AddMoneyInfo.BankDetails.errorCopy")} ${dataCopied} - ${t("AddMoneyInfo.BankDetails.tryAgain")} `
        }
        icon={!showErrorCopy ? <CopyIcon /> : <ErrorOutlineIcon />}
      />
      <NavHeader withBackButton={true} />
      <ScrollView>
        <View style={containerStyle}>
          <View style={InnerContainerStyle}>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("AddMoneyInfo.title")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" weight="regular" size="callout">
              {t("AddMoneyInfo.description")}
            </Typography.Text>
            <View style={noteContainerStyle}>
              <BadgeIcon color={badgeIconColor} />

              <Typography.Text color="neutralBase+20" weight="regular" size="footnote" style={contentBoxStyle}>
                {t("AddMoneyInfo.note")}
              </Typography.Text>
            </View>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
              {t("AddMoneyInfo.BankDetails.title")}
            </Typography.Text>

            <View style={bankDetailsContainerStyle}>
              {BankDetail.map(item => {
                return (
                  <View key={item.id}>
                    <BankDetails
                      key={item.id}
                      onCopyPress={() => handleOnCopyPress(item.value, item.label)}
                      label={item.label}
                      value={item.value}
                    />
                    {item.id === `${BankDetail.length}` ? null : <Divider color="neutralBase-40" />}
                  </View>
                );
              })}
            </View>
          </View>
          <Divider color="neutralBase-30" />
          <View style={historyContainerStyle}>
            <HistoryIcon color={historyIconColor} />
            <View>
              <Typography.Text color="neutralBase+30" weight="semiBold" size="body">
                {t("AddMoneyInfo.processingTime")}
              </Typography.Text>
              <View style={historyContentStyle}>
                <Typography.Text color="neutralBase-10" weight="regular" size="footnote">
                  {t("AddMoneyInfo.processingTimeInfo")}
                </Typography.Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
