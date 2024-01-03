import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { QRreader, QRscanner } from "react-native-qr-decode-image-camera";

import Button from "@/components/Button";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import Stack from "../Stack";
import Typography from "../Typography";

interface QrCodeScannerProps {
  onClose: () => void;
  onReadQR: (res?: string) => void;
  onError: () => void;
}

export default function QrCodeScanner({ onClose, onReadQR, onError }: QrCodeScannerProps) {
  const { t } = useTranslation();

  const handleOnOpenPhotosPress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
        includeBase64: true,
      });
      if (Array.isArray(result.assets) && result.assets?.length > 0) {
        const path = result.assets[0].uri;
        QRreader(path)
          .then((data: string) => {
            const accountNumberIndex = data.indexOf(":");
            const IbanIndex = data.indexOf("IBAN:");
            const acocountNumber = data.substring(accountNumberIndex + 1, IbanIndex).trim();
            onReadQR(acocountNumber);
          })
          .catch(() => {
            onError();
            onClose();
          });
      }
    } catch (error) {
      warn("upload-fie", "Could not pick photo: ", JSON.stringify(error));
    }
  };

  const topView = () => {
    return (
      <View style={styles.topTextStyle}>
        <Typography.Text
          color="neutralBase-60"
          weight="medium"
          testID="SignIn.IqamaInputScreen:SubTitleInput"
          size="callout"
          align="center">
          {t("QrCodeScreen.title")}
        </Typography.Text>
      </View>
    );
  };
  const bottomView = () => {
    return (
      <Stack direction="vertical" gap="4p" align="stretch" style={bottomViewStyle}>
        <Button
          color="dark"
          variant="secondary"
          size="small"
          testID="SignIn.IqamaInputScreen:ProceedButton"
          onPress={() => handleOnOpenPhotosPress()}>
          {t("QrCodeScreen.galleryButton")}
        </Button>
        <Button
          color="dark"
          variant="tertiary"
          testID="SignIn.IqamaInputScreen:ProceedButton"
          onPress={() => onClose()}>
          {t("QrCodeScreen.cancelButton")}
        </Button>
      </Stack>
    );
  };
  const onRead = (res: { data: string | undefined }) => {
    const data = res?.data;
    const accountNumberIndex = data?.indexOf(":");
    const IbanIndex = data?.indexOf("IBAN:");
    const acocountNumber = data?.substring(accountNumberIndex + 1, IbanIndex).trim();
    onReadQR(acocountNumber);
  };
  const bottomViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
  }));
  return (
    <View style={styles.container}>
      <View style={styles.topTextStyle}>
        <Typography.Text
          color="neutralBase-60"
          weight="medium"
          testID="SignIn.IqamaInputScreen:SubTitleInput"
          size="callout"
          align="center">
          {t("QrCodeScreen.title")}
        </Typography.Text>
      </View>
      <QRscanner
        hintText={t("QrCodeScreen.hintText")}
        onRead={onRead}
        renderTopView={topView}
        renderBottomView={bottomView}
        flashMode={false}
        zoom={0.2}
        finderY={50}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  topTextStyle: {
    alignSelf: "center",
    marginTop: 200,
    position: "absolute",
  },
});
