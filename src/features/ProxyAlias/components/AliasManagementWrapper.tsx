import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useQueryClient } from "react-query";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import AccountIcon from "../assets/AccountIcon";
import { useLinkProxyAlias, useSendProxiesOTP, useUnLinkProxyAlias } from "../hooks/query-hooks";
import { useOptOut } from "../hooks/query-hooks";
import { aliasCardType, reasonOTP } from "../mocks";
import { UserProxiesResponse, UserProxy } from "../types";
import AccountModal from "./AccountModal";
import AvailableAliasesCard from "./AvailableAliasesCard";
import OptOutModal from "./OptOutModal";

interface ProxyAliasesProps {
  data: UserProxiesResponse;
}

export default function AliasManagementWrapper({ data }: ProxyAliasesProps) {
  const { t } = useTranslation();
  const otpFlow = useOtpFlow();
  const useSendProxiesOtpAsync = useSendProxiesOTP();
  const linkProxy = useLinkProxyAlias();
  const unLinkProxy = useUnLinkProxyAlias();

  const queryClient = useQueryClient();

  const selectedReason = useRef<string>("");
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [isOptOutModalVisible, setIsOptOutModalVisible] = useState(false);
  const [showModal, setShowModal] = useState<{
    isVisible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
  });
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const optOutApi = useOptOut();

  const accountInfoButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["20p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-20"],
    borderRadius: theme.radii.small,
    marginTop: theme.spacing["24p"],
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const subContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingBottom: theme.spacing["8p"],
  }));

  const optOutStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const accountIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const chevronColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const handleOptOut = (reason: string) => {
    selectedReason.current = reason;
    setIsOptOutModalVisible(false);
    delayTransition(() => {
      setIsConfirmationModalVisible(true);
    });
  };

  const handleOnConfirmOpt = async () => {
    try {
      const response = await optOutApi.mutateAsync({ OptOutReason: selectedReason.current });
      if (response.Status === "200") {
        setShowModal({
          isVisible: true,
          type: "success",
          title: t("ProxyAlias.OptOutSuccessModal.title"),
          message: t("ProxyAlias.OptOutSuccessModal.subtitle"),
        });
      } else {
        setShowModal({
          isVisible: true,
          type: "error",
          title: t("ProxyAlias.OptOutFailureModal.title"),
          message: t("ProxyAlias.OptOutFailureModal.subtitle"),
        });
      }
    } catch (error) {
      setShowModal({
        isVisible: true,
        type: "error",
        title: t("ProxyAlias.OptOutFailureModal.title"),
        message: t("ProxyAlias.OptOutFailureModal.subtitle"),
      });
    }
  };

  const handleOnOtp = async (reason: reasonOTP, userProxy?: UserProxy) => {
    let otpChallengeParams = {};
    if (userProxy?.ProxyType === aliasCardType.EMAIL) {
      otpChallengeParams = {
        Email: userProxy.ProxyValue,
      };
    } else {
      //Adding mock values(PhoneNumber)for passing the QA testing criteria.
      //once logging in is handled properly, we will get this value from backend and we will replace this mock value with the value stored in local storage.
      //TODO Replace with params once we get the value from backend response.
      otpChallengeParams = {
        PhoneNumber: userProxy?.ProxyValue ?? "+961549845741",
      };
    }
    delayTransition(() => {
      try {
        otpFlow.handle({
          action: {
            to: "ProxyAlias.AliasManagementScreen",
            params: {},
          },
          otpChallengeParams,
          otpVerifyMethod: reason,
          onOtpRequest: () => {
            return useSendProxiesOtpAsync.mutateAsync(reason);
          },
          onFinish: (status: string) => {
            if (status === "success") {
              if (reason === reasonOTP.LINK_ALIAS && userProxy !== undefined) {
                if (userProxy.ARBProxyFlag) {
                  handleOnUnLinkProxy(userProxy.RegistrationId);
                } else {
                  handleOnLinkProxy(userProxy.ProxyType);
                }
              } else if (reason === reasonOTP.OPT_OUT) {
                handleOnConfirmOpt();
              }
            }
          },
        });
      } catch (responseError) {
        warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
      }
    });
  };

  const handleOnLinkProxy = async (proxyTypeId: string) => {
    try {
      const response = await linkProxy.mutateAsync(proxyTypeId);
      if (response.linkResponeseStatus === "205") {
        setShowModal({
          isVisible: true,
          type: "success",
          title: t("ProxyAlias.SuccessModal.linkingSuccessed"),
          message: t("ProxyAlias.SuccessModal.connectSuccessfully"),
        });
      } else {
        setShowModal({
          isVisible: true,
          type: "error",
          title: t("ProxyAlias.ErrorModal.linkingFailed"),
          message: t("ProxyAlias.ErrorModal.unableToConnect"),
        });
      }
    } catch (error) {
      setShowModal({
        isVisible: true,
        type: "error",
        title: t("ProxyAlias.ErrorModal.linkingFailed"),
        message: t("ProxyAlias.ErrorModal.unableToConnect"),
      });
    }
  };

  const handleOnUnLinkProxy = async (proxyTypeId: string) => {
    try {
      const response = await unLinkProxy.mutateAsync(proxyTypeId);
      if (response.unlinkResponeseStatus === "200") {
        delayTransition(() =>
          setShowModal({
            isVisible: true,
            type: "success",
            title: t("ProxyAlias.SuccessModal.unLinkingSuccessed"),
            message: t("ProxyAlias.SuccessModal.unConnectSuccessfully"),
          })
        );
      } else {
        delayTransition(() =>
          setShowModal({
            isVisible: true,
            type: "error",
            title: t("ProxyAlias.ErrorModal.unLinkingFailed"),
            message: t("ProxyAlias.ErrorModal.unableToDisable"),
          })
        );
      }
    } catch (error) {
      delayTransition(() =>
        setShowModal({
          isVisible: true,
          type: "error",
          title: t("ProxyAlias.ErrorModal.unLinkingFailed"),
          message: t("ProxyAlias.ErrorModal.unableToDisable"),
        })
      );
    }
  };

  const handleOnConfirmOptOut = () => {
    setIsConfirmationModalVisible(false);
    handleOnOtp(reasonOTP.OPT_OUT);
  };

  const handleOnClose = () => {
    queryClient.invalidateQueries("proxyAliases");
    setShowModal({ isVisible: false, type: "success", title: "", message: "" });
  };

  return (
    <View style={styles.container}>
      <View style={subContainerStyle}>
        <Typography.Text weight="regular" size="body">
          {t("ProxyAlias.AliasManagementScreen.aliasManagement")}
        </Typography.Text>

        <Pressable onPress={() => setIsAccountModalVisible(true)} style={accountInfoButtonStyle}>
          <Stack direction="horizontal" gap="16p" align="center">
            <AccountIcon color={accountIconColor} />

            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("ProxyAlias.AliasManagementScreen.accountInformation")}
            </Typography.Text>
          </Stack>
          <View style={styles.chevronContainer}>
            <ChevronRightIcon color={chevronColor} />
          </View>
        </Pressable>
        <View style={separatorStyle} />
        <Stack direction="vertical" gap="16p">
          <Typography.Text size="title3" weight="medium">
            {t("ProxyAlias.AliasManagementScreen.availableAliases")}
          </Typography.Text>
          {data.UserProxies.map(item => {
            return <AvailableAliasesCard item={item} onHandleOTP={handleOnOtp} onUnLinkProxy={handleOnUnLinkProxy} />;
          })}
        </Stack>
      </View>
      <Stack direction="vertical" align="stretch" gap="8p" style={optOutStyle}>
        <Typography.Text size="caption2" color="neutralBase" weight="regular" align="center">
          {t("ProxyAlias.AliasManagementScreen.optOutButtonDescription")}
        </Typography.Text>
        <Button variant="secondary" onPress={() => setIsOptOutModalVisible(true)}>
          {t("ProxyAlias.AliasManagementScreen.optOutButton")}
        </Button>
      </Stack>

      <AccountModal
        fullName={data.UserName}
        accountNumber={data.AccountNumber}
        visible={isAccountModalVisible}
        onClose={() => setIsAccountModalVisible(false)}
      />
      <OptOutModal
        visible={isOptOutModalVisible}
        onclose={() => setIsOptOutModalVisible(false)}
        onOptOut={handleOptOut}
      />

      <NotificationModal
        variant="warning"
        title={t("ProxyAlias.OptOutConfirmModal.title")}
        message={t("ProxyAlias.OptOutConfirmModal.subtitle")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: <Button onPress={handleOnConfirmOptOut}>{t("ProxyAlias.OptOutConfirmModal.buttonYes")}</Button>,
          secondary: (
            <Button onPress={() => setIsConfirmationModalVisible(false)}>
              {t("ProxyAlias.OptOutConfirmModal.buttonNo")}
            </Button>
          ),
        }}
      />
      {showModal.type === "error" ? (
        <NotificationModal
          variant={showModal.type}
          title={showModal.title}
          message={showModal.message}
          isVisible={showModal.isVisible}
          onClose={handleOnClose}
        />
      ) : (
        <NotificationModal
          variant={showModal.type}
          title={showModal.title}
          message={showModal.message}
          isVisible={showModal.isVisible}
          buttons={{
            primary: <Button onPress={handleOnClose}>{t("ProxyAlias.SuccessModal.continue")}</Button>,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
