import times from "lodash/times";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import InlineBanner from "../InlineBanner";
import NotificationModal from "../NotificationModal";
import Typography from "../Typography";
interface PasscodeInputProps {
  isError?: boolean;
  failedAttempts?: number;
  resetError?: () => void;
  length: number;
  passcode: string;
  title?: string;
  user?: { name: string } | null;
  subTitle?: string;
  notification: string;
  errorMessage?: string;
  errorTitle?: string;
  failedAttemptsLimit: number;
}
const PasscodeInput = ({
  isError,
  length,
  passcode,
  failedAttempts,
  failedAttemptsLimit,
  resetError,
  user,
  title,
  subTitle,
  errorMessage,
  notification,
  errorTitle,
}: PasscodeInputProps) => {
  const { t } = useTranslation();
  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["5p"],
  }));

  const profilePicWraper = useThemeStyles<TextStyle>(theme => ({
    height: theme.spacing["73p"],
    width: theme.spacing["73p"],
    borderRadius: theme.radii.xxlarge,
    marginRight: theme.spacing["10p"],
    marginBottom: theme.spacing["10p"],
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primaryBase,
  }));
  const subTitleStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const passcodeInput = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20"],
    height: theme.spacing["14p"],
    width: theme.spacing["14p"],
    marginHorizontal: theme.spacing["20p"],
    overflow: "hidden",
    borderRadius: theme.radii.small,
  }));

  const passcodeInputFill = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
  }));

  const inputWrap = useThemeStyles<ViewStyle>(theme => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
  }));
  const alertWrapper = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["16p"],
    width: "100%",
    height: theme.spacing["120p"],
    paddingTop: theme.spacing["24p"],
    marginBottom: theme.spacing["10p"],
  }));

  return (
    <>
      <View style={styles.container}>
        {user && (
          <View style={profilePicWraper}>
            <Typography.Text color="neutralBase-50" size="body" weight="semiBold">
              {user.name
                .split(" ")
                .map(value => value.charAt(0).toUpperCase())
                .join("")}
            </Typography.Text>
          </View>
        )}

        <Typography.Text style={titleStyle} color="neutralBase+30" weight="semiBold" size="title1">
          {title}
        </Typography.Text>
        <Typography.Text style={subTitleStyle} size="body" align="center">
          {subTitle ? subTitle : t("SignIn.passcodeInput.subTitle", { length, extra: user ? "" : "to login" })}
        </Typography.Text>
        <View style={inputWrap}>
          {times(length).map((item: number, index: number) => {
            const isFilled = passcode.length > index;
            return (
              <Fragment key={item}>
                <Typography.Text style={[passcodeInput, isFilled && passcodeInputFill]} />
              </Fragment>
            );
          })}
        </View>
        <View style={alertWrapper}>
          {isError && (
            <InlineBanner
              icon={<ErrorFilledCircleIcon height={20} width={20} />}
              text={notification}
              testID="toast-banner"
              variant="error"
            />
          )}
        </View>
        <NotificationModal
          message={errorMessage ?? ""}
          title={errorTitle ?? ""}
          isVisible={failedAttempts === failedAttemptsLimit}
          buttons={{
            primary: <Button onPress={resetError}>{t("OneTimePasswordModal.errors.button")}</Button>,
          }}
          variant="error"
        />
      </View>
    </>
  );
};

export default PasscodeInput;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
