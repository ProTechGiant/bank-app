import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { CopyIcon, ErrorOutlineIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import useAccount from "@/hooks/use-account";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function AccountDetailsScreen() {
  const navigation = useNavigation();
  const account = useAccount();
  const { t } = useTranslation();

  const copyColor = useThemeStyles<string>(theme => theme.palette["neutralBase-50"], []);
  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

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

  return (
    <>
      <DismissibleBanner
        visible={showBanner}
        variant={showErrorCopy ? "error" : "default"}
        icon={showErrorCopy ? <ErrorOutlineIcon /> : <CopyIcon color={copyColor} />}
        message={
          showErrorCopy
            ? `${t("Home.AccountDetails.banner.error", { dataCopied: dataCopied })}`
            : `${t("Home.AccountDetails.banner.success", { dataCopied: dataCopied })}`
        }
      />
      <Page>
        <NavHeader
          title={t("Home.AccountDetails.navHeader")}
          end={
            <NavHeader.CloseEndButton
              onPress={() => {
                navigation.goBack();
              }}
            />
          }
          withBackButton={false}
        />
        <ContentContainer style={contentContainer}>
          {undefined !== account.data ? (
            <TableListCardGroup>
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.name")}
                helperText={account.data.currentAccountName}
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.type")}
                helperText={account.data.currentAccountType}
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.holder")}
                helperText={account.data.currentAccountOwner} //will not work here for testing purposes
                end={
                  account.data.currentAccountOwner ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(
                          account.data.currentAccountOwner!,
                          `${t("Home.AccountDetails.tableLabels.holder")}`
                        )
                      }
                    />
                  ) : null
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.number")}
                helperText={account.data.currentAccoutNumber}
                end={
                  account.data.currentAccoutNumber ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(
                          account.data.currentAccoutNumber!,
                          `${t("Home.AccountDetails.tableLabels.number")}`
                        )
                      }
                    />
                  ) : null
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.code")}
                helperText={account.data.currentAccountBankCode}
                end={
                  account.data.currentAccountBankCode ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(
                          account.data.currentAccountBankCode!,
                          `${t("Home.AccountDetails.tableLabels.code")}`
                        )
                      }
                    />
                  ) : null
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.iban")}
                helperText={account.data.currentAccountIban}
                end={
                  account.data.currentAccountIban ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(
                          account.data.currentAccountIban!,
                          `${t("Home.AccountDetails.tableLabels.iban")}`
                        )
                      }
                    />
                  ) : null
                }
              />

              <TableListCard
                label={t("Home.AccountDetails.tableLabels.bankNameLabel")}
                helperText={t("Home.AccountDetails.tableLabels.bankName")}
              />
            </TableListCardGroup>
          ) : null}
        </ContentContainer>
      </Page>
    </>
  );
}
