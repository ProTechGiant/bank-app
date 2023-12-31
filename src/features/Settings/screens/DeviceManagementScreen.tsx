import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, SectionList, StyleSheet, View, ViewStyle } from "react-native";

import { AddIcon, DeleteIcon, WarningTriangleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { ActionsIds } from "@/features/SignIn/constants";
import { useGetDevices, useManageDevice } from "@/features/SignIn/hooks/query-hooks";
import { UserType } from "@/features/SignIn/types";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { logoutActionsIds, useLogout } from "@/hooks/use-logout";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { Device } from "../types";

export default function DeviceManagementScreen() {
  const logoutUser = useLogout();
  const { t } = useTranslation();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isUnRigisterModalVisible, setIsUnRigisterModalVisible] = useState(false);
  const [isRigisterModalVisible, setIsRigisterModalVisible] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [deviceId, setDeviceId] = useState("");

  const { data } = useGetDevices();
  const { mutateAsync: manageDevice, isLoading } = useManageDevice();

  useEffect(() => {
    (async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    })();
  }, []);

  const handleOnRigisterDevice = async (deviceID: string) => {
    try {
      await manageDevice({ ActionId: ActionsIds.Register, isvaUserId: user?.IsvaUserId, RequestDeviceId: deviceID });
    } catch (error) {
      warn("Error", error);
    }
    setIsRigisterModalVisible(false);
  };

  const handleOnDeRigisterDevice = async (deviceID: string) => {
    try {
      await manageDevice({ ActionId: ActionsIds.Deregister, isvaUserId: user?.IsvaUserId, RequestDeviceId: deviceID });

      if (user?.DeviceId === deviceId) {
        const authentication = await getAuthenticationToken();
        setIsUnRigisterModalVisible(false);
        await logoutUser.mutateAsync({ ActionId: logoutActionsIds.SIGNOUT_ONLY, token: authentication.AccessToken });
      }
    } catch (error) {
      warn("Error", error);
    }
    setIsUnRigisterModalVisible(false);
  };

  const handleOnClose = () => {
    setIsConfirmationModalVisible(false);
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["24p"],
  }));

  const deviceInfoContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    marginVertical: theme.spacing["4p"],
    borderTopRightRadius: theme.radii.medium,
    borderTopLeftRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const bottomSpacing = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const deviceRegisterContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderBottomRightRadius: theme.radii.medium,
    borderBottomLeftRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const loginDetailsContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["16p"],
    borderRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);
  const warningIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const getDeviceTypeTitle = (registeredDevice: number) => {
    return registeredDevice === 1
      ? t("Settings.DeviceManagement.registeredDevice")
      : t("Settings.DeviceManagement.oneTimeDevice");
  };

  if (!data || !data.Devices) {
    return null;
  }

  // Group devices by RegisteredDevice value
  const groupedData: Record<string, Device[]> = data.Devices.reduce((acc, item) => {
    const key = getDeviceTypeTitle(item.RegisteredDevice);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, Device[]>);

  // Convert the grouped data into an array of sections
  const sections = Object.keys(groupedData).map(key => ({
    title: key,
    data: groupedData[key],
  }));

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Page testID="Settings.DeviceManagement:Page" insets={["left", "right", "bottom", "top"]}>
          <NavHeader
            testID="Settings.DeviceManagement:NavHeader"
            withBackButton={true}
            title={t("Settings.DeviceManagement.title")}
          />

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={headerStyle}>
              <SectionList
                sections={sections}
                renderItem={({ item }) => (
                  <>
                    <View style={deviceInfoContainer}>
                      {item.RegisteredDevice === 0 ? (
                        <Stack
                          testID={`Settings.DeviceManagement:Stack-${item.RegisteredDevice}`}
                          direction="horizontal"
                          align="center"
                          gap="4p"
                          style={bottomSpacing}>
                          <WarningTriangleIcon color={warningIconColor} />
                          <Typography.Text color="neutralBase" weight="regular" size="footnote">
                            {t("Settings.DeviceManagement.notRegistered")}
                          </Typography.Text>
                        </Stack>
                      ) : null}

                      <Stack
                        testID={`Settings.DeviceManagement:Stack-${item.DeviceName}`}
                        direction="horizontal"
                        justify="space-between"
                        style={bottomSpacing}>
                        <Typography.Text color="neutralBase" weight="regular" size="footnote">
                          {t("Settings.DeviceManagement.deviceName")}
                        </Typography.Text>
                        <Typography.Text weight="medium" size="caption2">
                          {item.DeviceName}
                        </Typography.Text>
                      </Stack>
                      <Stack
                        testID={`Settings.DeviceManagement:Stack-${item.DeviceOsType}`}
                        direction="horizontal"
                        justify="space-between"
                        style={bottomSpacing}>
                        <Typography.Text color="neutralBase" weight="regular" size="footnote">
                          {t("Settings.DeviceManagement.deviceType")}
                        </Typography.Text>
                        <Typography.Text weight="medium" size="caption2">
                          {item.DeviceType}
                        </Typography.Text>
                      </Stack>
                      <Stack
                        testID={`Settings.DeviceManagement:Stack-${item.DeviceOsVersion}`}
                        direction="horizontal"
                        justify="space-between"
                        style={bottomSpacing}>
                        <Typography.Text color="neutralBase" weight="regular" size="footnote">
                          {t("Settings.DeviceManagement.operatingSystem")}
                        </Typography.Text>
                        <Typography.Text weight="medium" size="caption2">
                          {item.DeviceOsType}
                        </Typography.Text>
                      </Stack>
                      <Stack
                        testID={`Settings.DeviceManagement:Stack-${item.DeviceId}`}
                        direction="horizontal"
                        justify="space-between"
                        style={bottomSpacing}>
                        <Typography.Text color="neutralBase" weight="regular" size="footnote">
                          {t("Settings.DeviceManagement.deviceId")}
                        </Typography.Text>
                        <Typography.Text weight="medium" size="caption2">
                          {item.DeviceId}
                        </Typography.Text>
                      </Stack>
                      <Stack
                        testID={`Settings.DeviceManagement:Stack-${item.RegistrationDate}`}
                        direction="horizontal"
                        justify="space-between">
                        <Typography.Text color="neutralBase" weight="regular" size="footnote">
                          {t("Settings.DeviceManagement.dAndTOfRegistration")}
                        </Typography.Text>
                        <Typography.Text weight="medium" size="caption2">
                          {item.RegistrationDate}
                        </Typography.Text>
                      </Stack>
                    </View>
                    {item.RegisteredDevice === 1 ? (
                      <Pressable
                        onPress={() => {
                          setIsUnRigisterModalVisible(true);
                          setDeviceId(item.DeviceId);
                        }}>
                        <Stack
                          testID={`Settings.DeviceManagement:Stack-${item.RegisteredDevice}-1`}
                          direction="horizontal"
                          style={deviceRegisterContainer}
                          align="center"
                          gap="8p">
                          <DeleteIcon color={iconColor} />
                          <Typography.Text weight="medium" size="footnote">
                            {t("Settings.DeviceManagement.unRegisterModal.title")}
                          </Typography.Text>
                        </Stack>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => {
                          setIsRigisterModalVisible(true);
                          setDeviceId(item.DeviceId);
                        }}>
                        <Stack
                          testID={`Settings.DeviceManagement:Stack-${item.RegisteredDevice}-0`}
                          direction="horizontal"
                          style={deviceRegisterContainer}
                          align="center"
                          gap="8p">
                          <AddIcon color={iconColor} />
                          <Typography.Text weight="medium" size="footnote">
                            {t("Settings.DeviceManagement.registerModal.title")}
                          </Typography.Text>
                        </Stack>
                      </Pressable>
                    )}
                  </>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={styles.spacingStyle}>
                    <Typography.Text size="title3" weight="medium">
                      {title}
                    </Typography.Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View style={styles.spacingStyle}>
                <Typography.Text size="title3" weight="medium">
                  {t("Settings.DeviceManagement.loginDetails")}
                </Typography.Text>
              </View>

              <View style={loginDetailsContainer}>
                <Stack
                  testID={`Settings.DeviceManagement:Stack-${data?.LoginDetails.ActiveSession.LastLoginDate}`}
                  direction="horizontal"
                  justify="space-between"
                  align="center"
                  gap="8p">
                  <Typography.Text color="neutralBase" weight="regular" size="footnote">
                    {t("Settings.DeviceManagement.lastLoginDateAndTime")}
                  </Typography.Text>
                  <Typography.Text weight="medium" size="caption2">
                    {data?.LoginDetails.ActiveSession.LastLoginDate}
                  </Typography.Text>
                </Stack>
                <Stack
                  testID={`Settings.DeviceManagement:Stack-${data?.LoginDetails.ActiveSession.LastLoginLocation}`}
                  direction="horizontal"
                  justify="space-between"
                  align="center"
                  gap="8p">
                  <Typography.Text color="neutralBase" weight="regular" size="footnote">
                    {t("Settings.DeviceManagement.lastLoginDateAndTime")}
                  </Typography.Text>
                  <Typography.Text weight="medium" size="caption2">
                    {data?.LoginDetails.ActiveSession.LastLoginLocation}
                  </Typography.Text>
                </Stack>
              </View>
            </View>

            <NotificationModal
              testID="Settings.DeviceManagement:unRigisterModal"
              variant="warning"
              title={t("Settings.DeviceManagement.unRegisterModal.title")}
              message={t("Settings.DeviceManagement.unRegisterModal.description")}
              isVisible={isUnRigisterModalVisible}
              onClose={() => setIsUnRigisterModalVisible(false)}
              buttons={{
                primary: (
                  <Button
                    onPress={() => handleOnDeRigisterDevice(deviceId)}
                    testID="Settings.DeviceManagement:unRigisterConfirm">
                    {t("Settings.DeviceManagement.unRegisterModal.confirm")}
                  </Button>
                ),
                secondary: (
                  <Button
                    onPress={() => setIsUnRigisterModalVisible(false)}
                    testID="Settings.DeviceManagement:unRigisterCancel">
                    {t("Settings.DeviceManagement.unRegisterModal.cancel")}
                  </Button>
                ),
              }}
            />

            <NotificationModal
              testID="Settings.DeviceManagement:rigisterModal"
              variant="warning"
              title={t("Settings.DeviceManagement.registerModal.title")}
              message={t("Settings.DeviceManagement.registerModal.description")}
              isVisible={isRigisterModalVisible}
              onClose={() => setIsRigisterModalVisible(false)}
              buttons={{
                primary: (
                  <Button
                    onPress={() => handleOnRigisterDevice(deviceId)}
                    testID="Settings.DeviceManagement:rigisterConfirm">
                    {t("Settings.DeviceManagement.registerModal.confirm")}
                  </Button>
                ),
                secondary: (
                  <Button
                    onPress={() => setIsRigisterModalVisible(false)}
                    testID="Settings.DeviceManagement:unRigisterCancel">
                    {t("Settings.DeviceManagement.registerModal.cancel")}
                  </Button>
                ),
              }}
            />

            <NotificationModal
              testID="Settings.DeviceManagement:confirmationsModal"
              variant="confirmations"
              title={t("Settings.ConsentDetailedConfirmModal.errorMessage")}
              message={t("Settings.ConsentDetailedConfirmModal.subErrorMessage")}
              isVisible={isConfirmationModalVisible}
              onClose={handleOnClose}
            />
          </ScrollView>
        </Page>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  spacingStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
});
