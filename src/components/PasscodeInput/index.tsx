import times from "lodash/times";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
interface PasscodeInputProps {
  isPanicMode?: boolean;
  isError?: boolean;
  showModel?: boolean;
  testID?: string;
  resetError?: () => void;
  length: number;
  passcode: string;
  title?: string;
  user?: { CustomerName: string } | null;
  subTitle?: string;
  //TODO: CHANGE IT JUST AND OBJECT ELSE THAN GETTING AN ARRAY AND THEN JUST SELECTING 1ST INDEX
  errorMessage?: any[];
}
const PasscodeInput = ({
  isError,
  showModel,
  length,
  passcode,
  resetError,
  user,
  title,
  subTitle,
  errorMessage,
  testID,
  isPanicMode,
}: PasscodeInputProps) => {
  const { t } = useTranslation();
  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
  }));

  const profilePicWraper = useThemeStyles<TextStyle>(theme => ({
    height: 56,
    width: 56,
    borderRadius: theme.radii.xxlarge,
    marginRight: theme.spacing["12p"],
    marginBottom: theme.spacing["12p"],
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette["supportBase-10"],
  }));
  const subTitleStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const passcodeInput = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20"],
    height: theme.spacing["12p"],
    width: theme.spacing["12p"],
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
    paddingTop: theme.spacing["24p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <View testID={testID} style={styles.container}>
      {!isPanicMode ? (
        user ? (
          <View style={profilePicWraper}>
            <Typography.Text size="callout" weight="medium">
              {user.CustomerName.split(" ")
                .map(value => value.charAt(0).toUpperCase())
                .join("")}
            </Typography.Text>
          </View>
        ) : null
      ) : null}

      <Typography.Text style={titleStyle} color="neutralBase+30" weight="semiBold" size="title1">
        {title}
      </Typography.Text>
      <Typography.Text style={subTitleStyle} size="body" align="center">
        {subTitle
          ? subTitle
          : t("SignIn.passcodeInput.subTitle", { length, extra: user ? "" : t("SignIn.passcodeInput.toLogin") })}
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
        {isError && !showModel && errorMessage?.[0]?.message ? (
          <Alert message={errorMessage[0].message} variant="error" />
        ) : null}
      </View>
      {errorMessage?.length && isError && showModel ? (
        <NotificationModal
          message={errorMessage[0].modalMessage || errorMessage[0].message}
          title={errorMessage[0].title}
          isVisible={true}
          onClose={resetError}
          buttons={{
            primary: <Button onPress={resetError}>{t("OneTimePasswordModal.errors.button")}</Button>,
          }}
          variant="error"
        />
      ) : null}
    </View>
  );
};

export default PasscodeInput;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
});
