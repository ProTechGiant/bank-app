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
import useFetchAccount from "@/hooks/use-fetch-account";
import useGetPrimaryAddress from "@/hooks/use-get-primary-address";
import { useThemeStyles } from "@/theme";

import BankDetails from "../../component/BankDetails";
import BadgeIcon from "./badge.svg";
import HistoryIcon from "./history.svg";

export default function AddMoneyViaBankTransferScreen() {
  const { t } = useTranslation();

  const { data } = useFetchAccount();

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
    setShowErrorCopy(text.length < 1);
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
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.spacing["8p"],
    flexDirection: "row",
    alignContent: "center",
    padding: theme.spacing["20p"],
  }));

  const bankDetailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.spacing["8p"],
    paddingVertical: theme.spacing["16p"],
    gap: theme.spacing["4p"],
  }));

  const historyContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    flexDirection: "row",
    gap: 13.5,
  }));

  const historyContentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingRight: theme.spacing["32p"],
  }));

  const contentBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const BankDetail = [
    { id: "1", label: `${t("AddMoneyInfo.BankDetails.recipientName")}`, value: data?.customerFullName },
    { id: "2", label: `${t("AddMoneyInfo.BankDetails.recipientIBAN")}`, value: data?.currentAccountIBAN },

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
    <Page backgroundColor="neutralBase-50">
      <DismissibleBanner
        isError={showErrorCopy}
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
              <BadgeIcon />

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
                    {item.id === `${BankDetail.length}` ? null : <Divider color="neutralBase-20" />}
                  </View>
                );
              })}
            </View>
          </View>
          <Divider color="neutralBase-30" />
          <View style={historyContainerStyle}>
            <HistoryIcon />
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
