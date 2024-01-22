import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { Share, View, ViewStyle } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { ShareIcon } from "@/features/AllInOneCard/assets/icons";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useThemeStyles } from "@/theme";

import QrDetailsCard from "../components/QrDetailsCard";

export default function GenerateQrScreen() {
  const account = useCurrentAccount();
  const navigation = useNavigation();
  const accountDetails =
    "Account Number:" + account.data?.id + "\nIBAN:" + account.data?.iban + "\nAccount Name:" + account.data?.owner;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const croatiaIcon = require("../assets/croatiaqr.jpg");
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    marginTop: theme.spacing["24p"],
    alignItems: "center",
  }));

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["64p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    padding: theme.spacing["12p"],
  }));

  const handleOnShare = () => {
    this.svg.toDataURL(data => {
      const shareImageBase64 = {
        title: account.data?.name,
        url: `data:image/png;base64,${data}`,
      };
      Share.share(shareImageBase64);
    });
  };

  return (
    <SafeAreaProvider>
      <Page insets={["left", "right"]} backgroundColor="neutralBase+30">
        <CustomStatusBar barStyle="light-content" />
        <NavHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          title={t("InternalTransfers.GenerateQrScreen.title")}
          backgroundAngledColor="#1E1A25"
          variant="angled"
        />
        <ContentContainer isScrollView>
          <View style={containerStyle}>
            <QRCode
              value={accountDetails}
              getRef={c => (this.svg = c)}
              logo={croatiaIcon}
              size={200}
              color="white"
              backgroundColor="black"
            />
          </View>
          <View style={cardContainerStyle}>
            <QrDetailsCard title={t("InternalTransfers.GenerateQrScreen.accountNumberText")} value={account.data?.id} />
            <QrDetailsCard title={t("InternalTransfers.GenerateQrScreen.ibanText")} value={account.data?.iban} />
          </View>
        </ContentContainer>
        <View style={buttonStyle}>
          <Button onPress={handleOnShare} color="dark" variant="primary" iconLeft={<ShareIcon />}>
            {t("InternalTransfers.GenerateQrScreen.shareButtonText")}
          </Button>
        </View>
      </Page>
    </SafeAreaProvider>
  );
}
