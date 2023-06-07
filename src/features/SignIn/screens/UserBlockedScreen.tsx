import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import { getItemFromEncryptedStorage, removeItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { BLOCKED_TIME } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useCheckUserStatus } from "../hooks/query-hooks";
import { SignInStackParams } from "../SignInStack";

export default function UserBlockedScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<SignInStackParams, "SignIn.UserBlocked">>();
  const { mutateAsync } = useCheckUserStatus();
  const { setSignInCorrelationId } = useSignInContext();
  const [isItPermanentBlock, setIsItPermanentBlock] = useState(false);
  const [remainingSecs, setRemainingSecs] = useState<number>(0);
  const [userExist, setUserExist] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const getUser = async () => {
      const user = await getItemFromEncryptedStorage("user");
      setUserExist(!!user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const _correlationId = generateRandomId(); //TODO: can be moved to entry point or to be handled more efficiently
    setSignInCorrelationId(_correlationId);

    (async () => {
      const userBlocked = await getItemFromEncryptedStorage("UserBlocked");

      if (userBlocked !== null) {
        const isUserPermanentBlocked = JSON.parse(userBlocked);
        if (isUserPermanentBlocked === true) {
          setIsItPermanentBlock(true);
          checkUserAccountStatus();
          return;
        } else {
          // Assuming isUserPermanentBlocked is a string representing the end time
          handleTimeLogic(Number(isUserPermanentBlocked));
        }
      }
    })();
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => {
      clearTimeout(timeoutRef.current);
      backHandler.remove();
    };
  }, [userExist]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSecs(prevCountdown => (prevCountdown > 0 ? prevCountdown - 1 : prevCountdown));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkUserAccountStatus = async () => {
    try {
      const response = await mutateAsync();
      if (response) {
        const { UserStatus } = response;
        if (UserStatus === "active") {
          handleNavigate();
        } else {
          if (UserStatus === "temporary-blocked") {
            const userBlockTime = new Date().getTime() + BLOCKED_TIME * 60 * 1000; //TODO: replace with the value from API
            handleTimeLogic(userBlockTime);
          }
          setIsItPermanentBlock(UserStatus === "permanently-blocked");
        }
      }
    } catch (err) {
      warn("checkUserStatus", "Could check user status. Error: ", JSON.stringify(err));
    }
  };

  const handleTimeLogic = (endTime: number) => {
    const currentDateTime = new Date();
    const endDateTime = new Date(endTime);
    const remainingTime = endDateTime.getTime() - currentDateTime.getTime();
    if (remainingTime === 0) {
      handleNavigate();
    } else {
      timeoutRef.current = setTimeout(handleNavigate, remainingTime);
    }
    setRemainingSecs(Math.floor(remainingTime / 1000));
  };

  const handleNavigate = async () => {
    await removeItemFromEncryptedStorage("UserBlocked");
    navigation.navigate("SignIn.Iqama");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: theme.spacing["32p"],
  }));
  const badgeContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
  }));

  const badgeStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["64p"],
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
    borderRadius: theme.radii.xxlarge,
  }));

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const messageStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
    lineHeight: theme.typography.text._lineHeights.footnote,
  }));

  return (
    <View style={containerStyle}>
      <View style={badgeContainerStyle}>
        <Typography.Text color="neutralBase-40" style={badgeStyle}>
          {t("SignIn.UserExistBlockedScreen.title")}
        </Typography.Text>
      </View>
      <View>
        <Typography.Text size="xlarge" weight="bold" color="neutralBase-30" align="center" style={headingStyle}>
          {isItPermanentBlock
            ? t("SignIn.UserPermanentBlockScreen.heading")
            : userExist
            ? t("SignIn.UserExistBlockedScreen.heading")
            : t("SignIn.UserNotExistBlockedScreen.heading")}
        </Typography.Text>
        <Typography.Text size="body" align="center" weight="semiBold" color="neutralBase-50" style={messageStyle}>
          {!isItPermanentBlock
            ? t("SignIn.UserExistBlockedScreen.message", {
                type: params.type ?? "passcode",
                time: `${Math.floor(remainingSecs / 60)}:${Math.floor(remainingSecs % 60)
                  .toString()
                  .padStart(2, "0")}`,
              })
            : t("SignIn.UserPermanentBlockScreen.message")}
        </Typography.Text>
        {!isItPermanentBlock ? (
          <Typography.Text size="callout" align="center" weight="semiBold" color="neutralBase-50" style={messageStyle}>
            t("SignIn.UserExistBlockedScreen.suggestion")
          </Typography.Text>
        ) : null}
      </View>
    </View>
  );
}
