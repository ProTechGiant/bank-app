import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CopyIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function AccountDetailsScreen() {
  const navigation = useNavigation();
  const account = useCurrentAccount();
  const { t } = useTranslation();

  const [isCopiedBannerVisibleWithLabel, setIsCopiedBannerVisibleWithLabel] = useState<string | undefined>();

  const handleOnCopyPress = (value: string, label: string) => {
    Clipboard.setString(value);

    setIsCopiedBannerVisibleWithLabel(label);
    setTimeout(() => setIsCopiedBannerVisibleWithLabel(undefined), 4000);
  };

  const copyColor = useThemeStyles<string>(theme => theme.palette["neutralBase-50"]);

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  return (
    <SafeAreaProvider>
      <DismissibleBanner
        visible={isCopiedBannerVisibleWithLabel !== undefined}
        icon={<CopyIcon color={copyColor} />}
        message={t("Home.AccountDetails.banner.error", { dataCopied: isCopiedBannerVisibleWithLabel })}
      />
      <Page>
        <NavHeader
          title={t("Home.AccountDetails.navHeader")}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
          withBackButton={false}
        />
        <ContentContainer isScrollView style={contentContainer}>
          {undefined !== account.data ? (
            <TableListCardGroup>
              <TableListCard label={t("Home.AccountDetails.tableLabels.name")} helperText={account.data.name} />
              <TableListCard label={t("Home.AccountDetails.tableLabels.type")} helperText={account.data.accountType} />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.holder")}
                helperText={account.data.owner}
                end={
                  account.data.owner !== undefined ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.owner, `${t("Home.AccountDetails.tableLabels.holder")}`)
                      }
                    />
                  ) : null
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.number")}
                helperText={account.data.accountNumber}
                end={
                  account.data.accountNumber !== undefined ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.accountNumber, `${t("Home.AccountDetails.tableLabels.number")}`)
                      }
                    />
                  ) : null
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.code")}
                helperText={account.data.bankCode}
                end={
                  account.data.bankCode !== undefined ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.bankCode, `${t("Home.AccountDetails.tableLabels.code")}`)
                      }
                    />
                  ) : null
                }
              />
              <TableListCard
                label={t("Home.AccountDetails.tableLabels.iban")}
                helperText={account.data.iban}
                end={
                  account.data.iban !== undefined ? (
                    <TableListCard.Copy
                      onPress={() =>
                        handleOnCopyPress(account.data.iban, `${t("Home.AccountDetails.tableLabels.iban")}`)
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
    </SafeAreaProvider>
  );
}
