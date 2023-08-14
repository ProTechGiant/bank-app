import { t } from "i18next";
import { useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, Email, Mobile, NationalID } from "@/assets/icons";
import LinkIcon from "@/assets/icons/link.svg";
import UnLinkIcon from "@/assets/icons/unLink.svg";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useLinkProxyAlias, useUnLinkProxyAlias } from "../hooks/query-hooks";
import { aliasCardType } from "../mocks";
interface AliasCardProps {
  proxyType: string;
  proxyValue: string;
  isLinked?: boolean;
  isARBLinked?: boolean;
  isEmailRegistered?: boolean;
}

export default function AvailableAliasesCard({
  proxyType,
  proxyValue,
  isLinked = false,
  isARBLinked = false,
  isEmailRegistered = true,
}: AliasCardProps) {
  const [showSuccessModal, setShowSuccessModal] = useState<{ isVisible: boolean; title: string; message: string }>({
    isVisible: false,
    title: "",
    message: "",
  });
  const [showErrorModal, setShowErrorModal] = useState<{ isVisible: boolean; title: string; message: string }>({
    isVisible: false,
    title: "",
    message: "",
  });
  const [showWarningModal, setShowWarningModal] = useState(false);

  const linkProxy = useLinkProxyAlias();
  const unLinkProxy = useUnLinkProxyAlias();

  const handleOnLinkProxy = async (proxyTypeId: string) => {
    try {
      const response = await linkProxy.mutateAsync(proxyTypeId);
      if (response.linkResponeseStatus === "success") {
        setShowSuccessModal({
          isVisible: true,
          title: t("ProxyAlias.SuccessModal.linkingSuccessed"),
          message: t("ProxyAlias.SuccessModal.connectSuccessfully"),
        });
      } else {
        setShowErrorModal({
          isVisible: true,
          title: t("ProxyAlias.ErrorModal.linkingFailed"),
          message: t("ProxyAlias.ErrorModal.unableToConnect"),
        });
      }
    } catch (error) {
      setShowErrorModal({
        isVisible: true,
        title: t("ProxyAlias.ErrorModal.linkingFailed"),
        message: t("ProxyAlias.ErrorModal.unableToConnect"),
      });
    }
  };

  const handleOnUnLinkProxy = async (proxyTypeId: string) => {
    try {
      const response = await unLinkProxy.mutateAsync(proxyTypeId);
      if (response.unlinkResponeseStatus === "success") {
        setShowSuccessModal({
          isVisible: true,
          title: t("ProxyAlias.SuccessModal.unLinkingSuccessed"),
          message: t("ProxyAlias.SuccessModal.unConnectSuccessfully"),
        });
      } else {
        setShowErrorModal({
          isVisible: true,
          title: t("ProxyAlias.ErrorModal.unLinkingFailed"),
          message: t("ProxyAlias.ErrorModal.unableToDisable"),
        });
      }
    } catch (error) {
      setShowErrorModal({
        isVisible: true,
        title: t("ProxyAlias.ErrorModal.unLinkingFailed"),
        message: t("ProxyAlias.ErrorModal.unableToDisable"),
      });
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
  }));

  const linkedContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.secondary_mintBase,
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    marginBottom: theme.spacing["4p"],
  }));

  const middleViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
  }));

  const yellowBaseColor = useThemeStyles(theme => theme.palette["secondary_yellowBase-10"]);
  const neutralBaseColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const iconColor = useThemeStyles<string | undefined>(
    theme => {
      let color;
      if (isLinked && !isARBLinked) {
        color = theme.palette.secondary_mintBase;
      } else if (isARBLinked) {
        color = theme.palette["secondary_yellowBase-10"];
      } else {
        color = theme.palette["neutralBase-20"];
      }
      return color;
    },
    [isLinked, isARBLinked]
  );

  const renderIcon = () => {
    switch (proxyType) {
      case aliasCardType.MOBILE_NUMBER:
        return <Mobile color={iconColor} />;
      case aliasCardType.NATIONAL_ID:
        return <NationalID color={iconColor} />;
      case aliasCardType.EMAIL:
        return <Email color={iconColor} />;
      default:
        return null;
    }
  };

  const renderAliasType = () => {
    switch (proxyType) {
      case aliasCardType.MOBILE_NUMBER:
        return t("ProxyAlias.AliasManagementScreen.mobileNumber");
      case aliasCardType.NATIONAL_ID:
        return t("ProxyAlias.AliasManagementScreen.nationalID");
      case aliasCardType.EMAIL:
        return t("ProxyAlias.AliasManagementScreen.email");
      default:
        return null;
    }
  };

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" flex={1}>
        {renderIcon()}
        <Stack direction="vertical" gap="4p" flex={1} style={middleViewStyle}>
          {isLinked || isARBLinked ? (
            <>
              <View style={[linkedContainerStyle, isARBLinked && { backgroundColor: yellowBaseColor }]}>
                <Typography.Text color="neutralBase-60" size="caption2" weight="medium">
                  {`${t("ProxyAlias.AliasManagementScreen.linked")} ${renderAliasType()}`}
                </Typography.Text>
              </View>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {proxyValue}
              </Typography.Text>
              {isARBLinked && (
                <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
                  {t("ProxyAlias.AliasManagementScreen.ARBLinked")}
                  <Pressable
                    onPress={() => {
                      //TODO when API is ready
                    }}>
                    <Typography.Text
                      color="primaryBase-40"
                      align="center"
                      weight="medium"
                      size="footnote"
                      style={styles.underline}>
                      {t("ProxyAlias.AliasManagementScreen.linkToCroatia")}
                    </Typography.Text>
                  </Pressable>
                </Typography.Text>
              )}
            </>
          ) : proxyType === aliasCardType.EMAIL && !isEmailRegistered ? (
            <>
              <Typography.Text size="callout" weight="medium">
                {t("ProxyAlias.AliasManagementScreen.registerYourEmail")}
              </Typography.Text>
              <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
                {t("ProxyAlias.AliasManagementScreen.registerInfo")}
              </Typography.Text>
            </>
          ) : (
            <>
              <Typography.Text size="callout" weight="medium">
                {`${t("ProxyAlias.AliasManagementScreen.linkYour")} ${renderAliasType()}`}
              </Typography.Text>
              <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
                {proxyValue}
              </Typography.Text>
            </>
          )}
        </Stack>
      </Stack>
      {isLinked || isARBLinked ? (
        <Pressable onPress={() => setShowWarningModal(true)}>
          <UnLinkIcon />
        </Pressable>
      ) : !isEmailRegistered ? (
        <ChevronRightIcon color={neutralBaseColor} />
      ) : (
        <Pressable onPress={() => setShowWarningModal(true)}>
          <LinkIcon />
        </Pressable>
      )}

      <NotificationModal
        variant="error"
        onClose={() => setShowErrorModal({ isVisible: false, title: "", message: "" })}
        title={showErrorModal.title}
        message={showErrorModal.message}
        isVisible={showErrorModal.isVisible}
      />

      <NotificationModal
        variant="success"
        title={showSuccessModal.title}
        message={showSuccessModal.message}
        isVisible={showSuccessModal.isVisible}
        buttons={{
          primary: (
            <Button onPress={() => setShowSuccessModal({ isVisible: false, title: "", message: "" })}>
              {t("ProxyAlias.SuccessModal.continue")}
            </Button>
          ),
        }}
      />

      {/* TODO when otp screen and API is ready */}
      <NotificationModal
        variant="warning"
        title={isLinked ? t("ProxyAlias.WarningModal.unLinkingWarning") : t("ProxyAlias.WarningModal.linkingWarning")}
        message={isLinked ? t("ProxyAlias.WarningModal.unWarningCheck") : t("ProxyAlias.WarningModal.warningCheck")}
        isVisible={showWarningModal}
        buttons={{
          primary: (
            <Button
              onPress={() => {
                if (isLinked) {
                  handleOnUnLinkProxy(proxyType);
                } else {
                  handleOnLinkProxy(proxyType);
                }
                setShowWarningModal(false);
              }}>
              {t("ProxyAlias.WarningModal.pcoceed")}
            </Button>
          ),
          secondary: <Button onPress={() => setShowWarningModal(false)}>{t("ProxyAlias.WarningModal.cancel")}</Button>,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: "underline",
  },
});
