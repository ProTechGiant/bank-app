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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { aliasCardType, reasonOTP } from "../mocks";
import { UserProxy } from "../types";

interface AliasCardProps {
  item: UserProxy;
  onHandleOTP: (reason: reasonOTP, userProxy: UserProxy) => void;
  onUnLinkProxy: (proxyTypeId: string) => void;
}

export default function AvailableAliasesCard({ item, onHandleOTP, onUnLinkProxy }: AliasCardProps) {
  const navigation = useNavigation();
  const { ProxyType, ProxyValue, ARBProxyFlag, RegistrationId } = item;
  const isLinked = !!RegistrationId;
  const isEmailRegistered = ProxyType === aliasCardType.EMAIL ? !!ProxyValue : true;

  const [warningModal, setWarningModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

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
      let color = theme.palette["neutralBase-20"];
      if (isLinked && !ARBProxyFlag) {
        color = theme.palette.secondary_mintBase;
      } else if (ARBProxyFlag) {
        color = theme.palette["secondary_yellowBase-10"];
      }
      return color;
    },
    [isLinked, ARBProxyFlag]
  );

  const renderIcon = () => {
    switch (ProxyType) {
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
    switch (ProxyType) {
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

  const handleOnPress = () => {
    if (!isLinked) {
      setWarningModal({
        isVisible: true,
        title: isEmailRegistered
          ? t("ProxyAlias.WarningModal.linkingWarning")
          : t("ProxyAlias.WarningModal.registerEmailWarning"),
        message: isEmailRegistered
          ? t("ProxyAlias.WarningModal.warningCheck")
          : t("ProxyAlias.WarningModal.registerEmailCheck"),
      });
    }
  };

  const handleOnConfirm = () => {
    if (isLinked && !ARBProxyFlag) {
      onUnLinkProxy(RegistrationId);
    } else if (!isEmailRegistered) {
      navigation.navigate("ProxyAlias.RegisterEmailScreen");
    } else {
      onHandleOTP(reasonOTP.LINK_ALIAS, item);
    }
    setWarningModal({
      isVisible: false,
      title: "",
      message: "",
    });
  };

  const handleOnCancel = () => {
    setWarningModal({
      isVisible: false,
      title: "",
      message: "",
    });
  };

  const handleOnARBLink = () => {
    setWarningModal({
      isVisible: true,
      title: t("ProxyAlias.WarningModal.overrideWarning"),
      message: t("ProxyAlias.WarningModal.overrideCheck"),
    });
  };

  const handleOnUnLink = () => {
    if (!ARBProxyFlag) {
      setWarningModal({
        isVisible: true,
        title: t("ProxyAlias.WarningModal.unLinkingWarning"),
        message: t("ProxyAlias.WarningModal.unWarningCheck"),
      });
    }
  };

  return (
    <Pressable style={containerStyle} onPress={handleOnPress}>
      <Stack direction="horizontal" flex={1}>
        {renderIcon()}
        <Stack direction="vertical" gap="4p" flex={1} style={middleViewStyle}>
          {isLinked || ARBProxyFlag ? (
            <>
              <View style={[linkedContainerStyle, ARBProxyFlag && { backgroundColor: yellowBaseColor }]}>
                <Typography.Text color="neutralBase-60" size="caption2" weight="medium">
                  {`${t("ProxyAlias.AliasManagementScreen.linked")} ${renderAliasType()}`}
                </Typography.Text>
              </View>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {ProxyValue}
              </Typography.Text>
              {ARBProxyFlag && (
                <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
                  {t("ProxyAlias.AliasManagementScreen.ARBLinked")}
                  <Pressable onPress={handleOnARBLink}>
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
          ) : ProxyType === aliasCardType.EMAIL && !isEmailRegistered ? (
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
                {ProxyValue}
              </Typography.Text>
            </>
          )}
        </Stack>
      </Stack>
      {isLinked || ARBProxyFlag ? (
        <Pressable onPress={handleOnUnLink}>
          <UnLinkIcon />
        </Pressable>
      ) : !isEmailRegistered ? (
        <ChevronRightIcon color={neutralBaseColor} />
      ) : (
        <LinkIcon />
      )}

      {/* TODO when otp screen and API is ready */}
      <NotificationModal
        variant="warning"
        title={warningModal.title}
        message={warningModal.message}
        isVisible={warningModal.isVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnConfirm}>
              {isEmailRegistered ? t("ProxyAlias.WarningModal.pcoceed") : t("ProxyAlias.WarningModal.register")}
            </Button>
          ),
          secondary: <Button onPress={handleOnCancel}>{t("ProxyAlias.WarningModal.cancel")}</Button>,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: "underline",
  },
});
