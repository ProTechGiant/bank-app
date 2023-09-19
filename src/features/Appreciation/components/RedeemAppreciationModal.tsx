import Barcode from "@kichiyaki/react-native-barcode-generator";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import QRCode from "react-native-qrcode-svg";

import { AppleWalletIcon, CopyIcon, IconProps } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { VoucherCodeEnum } from "../types";

interface RedeemAppreciationModalProps {
  isVisible: boolean;
  setIsVisible: (status: boolean) => void;
  isExpired: boolean;
  expiryDate: string;
  code: string;
  title: string;
  location: string;
  time: string;
  userFullName: string;
  partnerName: string;
  codeType: VoucherCodeEnum;
  password: string;
  handleOnViewDetailsPress: () => void;
  handleOnAddToAppleWalletPress: () => void;
}
export default function RedeemAppreciationModal({
  isExpired,
  expiryDate,
  isVisible,
  setIsVisible,
  code,
  title,
  userFullName,
  location,
  time,
  partnerName,
  codeType,
  password,
  handleOnViewDetailsPress,
  handleOnAddToAppleWalletPress,
}: RedeemAppreciationModalProps) {
  const { t } = useTranslation();

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const hasPassword = password !== undefined && password !== "";
  const qrCodeHeight = windowHeight * 0.15;
  const barCodeHeight = windowHeight * 0.1;
  const couponCodeHeight = windowHeight * 0.05;
  const codeHeight =
    (hasPassword ? windowHeight * 0.1 : 0) +
    (codeType === VoucherCodeEnum.QR
      ? qrCodeHeight
      : codeType === VoucherCodeEnum.BARCODE
      ? barCodeHeight + 0.02 * windowHeight
      : couponCodeHeight);

  const fields = [
    {
      key: t("Appreciation.RedeemModal.name"),
      value: userFullName,
    },
    {
      key: t("Appreciation.RedeemModal.time"),
      value: time,
    },
    {
      key: t("Appreciation.RedeemModal.location"),
      value: location,
    },
  ];

  const handleOnCopyPasswordPress = () => {
    Clipboard.setString(password);
  };

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "85%",
    backgroundColor: theme.palette["supportBase-10"],
    paddingBottom: theme.spacing["20p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const barCodeStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["24p"],
    borderRadius: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["16p"],
    gap: theme.spacing["16p"],
  }));

  const passwordContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    alignItems: "center",
    justifyContent: "center",
  }));

  const copyIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    borderRadius: theme.spacing["64p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const copyIconStyle = useThemeStyles<IconProps>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
    color: theme.palette.primaryBase,
  }));

  const sideCircleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["supportBase-10"],
      width: theme.spacing["32p"],
      height: theme.spacing["32p"],
      borderRadius: theme.spacing["64p"],
      position: "absolute",
      top: codeHeight + (hasPassword ? theme.spacing["48p"] : theme.spacing["32p"]),
      zIndex: 1,
    }),
    [codeHeight, hasPassword]
  );

  const leftCircleStyle = useThemeStyles<ViewStyle>(theme => ({
    ...sideCircleStyle,
    left: -theme.spacing["16p"],
  }));

  const rightCircleStyle = useThemeStyles<ViewStyle>(theme => ({
    ...sideCircleStyle,
    right: -theme.spacing["16p"],
  }));

  const dashedLineStyle = useThemeStyles<ViewStyle>(theme => ({
    width: windowWidth,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const fieldsStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: theme.spacing["20p"],
  }));

  return (
    <Modal
      closeHasBackground={true}
      style={modalStyle}
      visible={isVisible}
      onClose={() => setIsVisible(false)}
      statusBarTranslucent={true}
      headerText={`${
        !isExpired ? t("Appreciation.RedeemModal.validUntil") : t("Appreciation.RedeemModal.expiredOn")
      } ${expiryDate}`}>
      <ScrollView style={contentContainerStyle} showsVerticalScrollIndicator={false}>
        <View style={contentStyle}>
          {codeType === VoucherCodeEnum.QR ? (
            <QRCode value={code} size={qrCodeHeight} />
          ) : codeType === VoucherCodeEnum.BARCODE ? (
            <Barcode value={code} text={code} height={barCodeHeight} style={barCodeStyle} />
          ) : (
            <Typography.Text size="xlarge" weight="medium" color="neutralBase+30">
              {code}
            </Typography.Text>
          )}
          {hasPassword ? (
            <>
              <Typography.Text color="neutralBase-10" size="callout" weight="medium">
                {t("Appreciation.RedeemModal.passwordTitle")}
              </Typography.Text>
              <Stack direction="horizontal" style={passwordContainerStyle} gap="8p">
                <Typography.Text color="primaryBase" size="callout" weight="medium">
                  {password}
                </Typography.Text>
                <Pressable style={copyIconContainerStyle} onPress={handleOnCopyPasswordPress}>
                  <CopyIcon {...copyIconStyle} />
                </Pressable>
              </Stack>
            </>
          ) : null}
        </View>
        <View style={leftCircleStyle} />
        <View style={rightCircleStyle} />
        <View style={dashedLineStyle} />
        <Stack direction="vertical" style={contentStyle} gap="8p">
          <Typography.Text color="neutralBase+30" size="footnote">
            {`${partnerName} ${t("Appreciation.RedeemModal.title")}`}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" size="title2" weight="medium">
            {title}
          </Typography.Text>
          {fields.map(field => (
            <View key={field.key} style={fieldsStyle}>
              <Typography.Text size="callout" color="neutralBase">
                {field.key}
              </Typography.Text>
              <Typography.Text size="callout" color="neutralBase+30">
                {field.value}
              </Typography.Text>
            </View>
          ))}
          <View style={styles.addToAppleWalletButtonStyle}>
            <Button
              onPress={handleOnAddToAppleWalletPress}
              iconLeft={<AppleWalletIcon width={37} height={28} />}
              size="small">
              <Typography.Text color="neutralBase-60">{t("Appreciation.RedeemModal.addToAppleWallet")}</Typography.Text>
            </Button>
          </View>
          <Button variant="tertiary" onPress={handleOnViewDetailsPress}>
            <Typography.Text style={styles.viewDetailsTextStyle} color="primaryBase-30">
              {t("Appreciation.RedeemModal.viewDetails")}
            </Typography.Text>
          </Button>
        </Stack>
      </ScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  addToAppleWalletButtonStyle: {
    width: "100%",
  },
  viewDetailsTextStyle: {
    textDecorationLine: "underline",
  },
});
