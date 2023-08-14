import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function AccountDetailsScreen() {
  const navigation = useNavigation();
  const account = useCurrentAccount();
  const { t } = useTranslation();

  const addToast = useToasts();

  const handleOnCopyPress = (value: string, label: string) => {
    Clipboard.setString(value);

    addToast({
      variant: "confirm",
      message: t("Home.AccountDetails.banner.success", { dataCopied: label }),
    });
  };

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={t("Home.AccountDetails.navHeader")}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
          withBackButton={false}
        />
        <ContentContainer isScrollView style={contentContainer}>
          {undefined !== account.data ? (
            <List isBordered>
              <List.Item.Primary label={t("Home.AccountDetails.tableLabels.name")} helperText={account.data.name} />
              <List.Item.Primary
                label={t("Home.AccountDetails.tableLabels.type")}
                helperText={account.data.accountType}
              />
              <List.Item.Primary
                label={t("Home.AccountDetails.tableLabels.holder")}
                helperText={account.data.owner}
                end={
                  account.data.owner !== undefined ? (
                    <List.End.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.owner, `${t("Home.AccountDetails.tableLabels.holder")}`)
                      }
                    />
                  ) : null
                }
              />
              <List.Item.Primary
                label={t("Home.AccountDetails.tableLabels.number")}
                helperText={account.data.accountNumber}
                end={
                  account.data.accountNumber !== undefined ? (
                    <List.End.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.accountNumber, `${t("Home.AccountDetails.tableLabels.number")}`)
                      }
                    />
                  ) : null
                }
              />
              <List.Item.Primary
                label={t("Home.AccountDetails.tableLabels.code")}
                helperText={account.data.bankCode}
                end={
                  account.data.bankCode !== undefined ? (
                    <List.End.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.bankCode, `${t("Home.AccountDetails.tableLabels.code")}`)
                      }
                    />
                  ) : null
                }
              />
              <List.Item.Primary
                label={t("Home.AccountDetails.tableLabels.iban")}
                helperText={account.data.iban}
                end={
                  account.data.iban !== undefined ? (
                    <List.End.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.iban, `${t("Home.AccountDetails.tableLabels.iban")}`)
                      }
                    />
                  ) : null
                }
              />
              <List.Item.Primary
                label={t("Home.AccountDetails.tableLabels.bankNameLabel")}
                helperText={t("Home.AccountDetails.tableLabels.bankName")}
              />
            </List>
          ) : null}
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
