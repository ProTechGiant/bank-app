import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import AccountIcon from "../assets/AccountIcon";
import { useOptOut } from "../hooks/query-hooks";
import { aliasCardType } from "../mocks";
import { UserProxiesResponse } from "../types";
import AccountModal from "./AccountModal";
import AvailableAliasesCard from "./AvailableAliasesCard";
import OptOutModal from "./OptOutModal";

interface ProxyAliasesProps {
  data: UserProxiesResponse;
}

export default function AliasManagementWrapper({ data }: ProxyAliasesProps) {
  const { t } = useTranslation();

  const selectedReason = useRef<string>("");
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [isOptOutModalVisible, setIsOptOutModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isSuccesOptOutModalVisible, setIsSuccesOptOutModalVisible] = useState(false);
  const [isFailureOptOutModalVisible, setIsFailureOptOutModalVisible] = useState(false);

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

  const optOutStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  const accountIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const chevronColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const handleOptOut = (reason: string) => {
    selectedReason.current = reason;
    setIsOptOutModalVisible(false);
    setIsConfirmationModalVisible(true);
  };

  const handleOnConfirmOpt = () => {
    setIsConfirmationModalVisible(false);
    optOutApi.mutate(
      { OptOutReason: selectedReason.current },
      {
        onSuccess: () => {
          setIsSuccesOptOutModalVisible(true);
        },
        onError: () => {
          setIsFailureOptOutModalVisible(true);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View>
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
            return (
              <AvailableAliasesCard
                proxyType={item.ProxyType}
                isLinked={!!item.RegistrationId}
                proxyValue={item.ProxyValue}
                isARBLinked={item.ARBProxyFlag}
                isEmailRegistered={item.ProxyType === aliasCardType.EMAIL ? !!item.ProxyValue : true}
              />
            );
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
        variant="confirmations"
        title={t("ProxyAlias.OptOutConfirmModal.title")}
        message={t("ProxyAlias.OptOutConfirmModal.subtitle")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: <Button onPress={handleOnConfirmOpt}>{t("ProxyAlias.OptOutConfirmModal.buttonYes")}</Button>,
          secondary: (
            <Button onPress={() => setIsConfirmationModalVisible(false)}>
              {t("ProxyAlias.OptOutConfirmModal.buttonNo")}
            </Button>
          ),
        }}
      />
      {isSuccesOptOutModalVisible && (
        <NotificationModal
          variant="success"
          onClose={() => {
            setIsSuccesOptOutModalVisible(false);
          }}
          title={t("ProxyAlias.OptOutSuccessModal.title")}
          message={t("ProxyAlias.OptOutSuccessModal.subtitle")}
          isVisible={true}
        />
      )}
      {isFailureOptOutModalVisible && (
        <NotificationModal
          variant="error"
          onClose={() => {
            setIsFailureOptOutModalVisible(false);
          }}
          title={t("ProxyAlias.OptOutFailureModal.title")}
          message={t("ProxyAlias.OptOutFailureModal.subtitle")}
          isVisible={true}
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
