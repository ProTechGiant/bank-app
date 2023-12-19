import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import List from "@/components/List";
import { useInfoStyles } from "@/components/List/styling";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import usePrimaryAddress from "@/hooks/use-primary-address";
import { useThemeStyles } from "@/theme";

import { BadgeIcon, HistoryIcon } from "../assets/icons";

export default function AddMoneyViaBankTransferScreen() {
  const { t } = useTranslation();

  const { data } = useCurrentAccount();
  const getPrimaryAddress = usePrimaryAddress();
  const addToast = useToasts();
  const { iconColor } = useInfoStyles();

  const handleOnCopyPress = (value: string, label: string) => {
    if (value !== undefined) {
      Clipboard.setString(value);
      addToast({
        variant: "confirm",
        message: `${label} ${t("AddMoneyInfo.BankDetails.copyInfo")}`,
        isDark: true,
        icon: <CopyIcon />,
      });
    } else {
      addToast({
        variant: "negative",
        message: `${label} ${t("AddMoneyInfo.BankDetails.errorCopy")} ${label} - ${t(
          "AddMoneyInfo.BankDetails.tryAgain"
        )}`,
      });
    }
  };

  const historyContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    flexDirection: "row",
    gap: 13.5,
  }));

  const historyContentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
    paddingRight: theme.spacing["32p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const badgeIconColor = useThemeStyles<string>(theme => theme.palette.complimentBase);
  const historyIconColor = useThemeStyles<string>(theme => theme.palette.complimentBase);

  const details = [
    { label: t("AddMoneyInfo.BankDetails.recipientName"), value: data?.owner },
    { label: t("AddMoneyInfo.BankDetails.recipientIBAN"), value: data?.iban },

    { label: t("AddMoneyInfo.BankDetails.bankName"), value: "Croatia Bank Ltd" },
    {
      label: t("AddMoneyInfo.BankDetails.recipientAddress"),
      value: `${getPrimaryAddress.data?.AddressLineOne ? getPrimaryAddress.data?.AddressLineOne + ", " : ""}${
        getPrimaryAddress.data?.AddressLineTwo ? getPrimaryAddress.data?.AddressLineTwo + ", " : ""
      }${getPrimaryAddress.data?.District ? getPrimaryAddress.data?.District + ", " : ""}${
        getPrimaryAddress.data?.City ? getPrimaryAddress.data?.City + ", " : ""
      }${getPrimaryAddress.data?.PostalCode ? getPrimaryAddress.data?.PostalCode + ", " : ""}${
        getPrimaryAddress.data?.Country ? getPrimaryAddress.data?.Country : ""
      }`,
    },
  ];
  const listContentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    ...theme.shadow["shadow-1"],
    borderRadius: theme.radii.small,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer isScrollView>
        <Stack align="stretch" direction="vertical" gap="20p">
          <Stack direction="vertical" align="stretch" gap="16p">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("AddMoneyInfo.title")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" weight="regular" size="callout">
              {t("AddMoneyInfo.description")}
            </Typography.Text>
          </Stack>
          <List isBordered style={listContentStyle}>
            <List.Item.Primary
              isTextLarge={true}
              icon={<BadgeIcon color={badgeIconColor} />}
              label={t("AddMoneyInfo.note")}
            />
          </List>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
            {t("AddMoneyInfo.BankDetails.title")}
          </Typography.Text>
          <List isBordered style={listContentStyle}>
            {details.map(element => (
              <List.Item.Primary
                isTextLarge={true}
                label={element.label}
                helperText={element.value}
                end={
                  <List.End.Copy
                    icon={<CopyIcon color={iconColor} height={16} width={16} />}
                    onPress={() => {
                      handleOnCopyPress(element?.value, element?.label);
                    }}
                  />
                }
              />
            ))}
          </List>
          <Divider color="neutralBase-30" />
        </Stack>
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
      </ContentContainer>
    </Page>
  );
}
