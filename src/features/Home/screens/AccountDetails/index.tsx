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
              <TableListCard label={t("Home.AccountDetails.tableLabels.name")} helperText={account.data.accountName} />
              <TableListCard label={t("Home.AccountDetails.tableLabels.type")} helperText={account.data.accountType} />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.holder")}
                helperText={account.data.owner}
                end={
                  <TableListCard.Copy
                    onCopyPress={() =>
                      handleOnCopyPress(account.data.owner, `${t("Home.AccountDetails.tableLabels.holder")}`)
                    }
                  />
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.number")}
                helperText={account.data.accountNumber}
                end={
                  <TableListCard.Copy
                    onCopyPress={() =>
                      handleOnCopyPress(account.data.accountNumber, `${t("Home.AccountDetails.tableLabels.number")}`)
                    }
                  />
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.code")}
                helperText={account.data.bankCode}
                end={
                  <TableListCard.Copy
                    onCopyPress={() =>
                      handleOnCopyPress(account.data.bankCode, `${t("Home.AccountDetails.tableLabels.code")}`)
                    }
                  />
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.iban")}
                helperText={account.data.accountIban}
                end={
                  <TableListCard.Copy
                    onCopyPress={() =>
                      handleOnCopyPress(account.data.accountIban, `${t("Home.AccountDetails.tableLabels.iban")}`)
                    }
                  />
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
