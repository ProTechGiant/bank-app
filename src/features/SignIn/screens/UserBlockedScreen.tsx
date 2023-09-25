import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, useWindowDimensions, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import {
  getItemFromEncryptedStorage,
  hasItemInStorage,
  removeItemFromEncryptedStorage,
} from "@/utils/encrypted-storage";

import AppLockedPermanentImage from "../assets/AppLockedPermanentImage";
import AppLockedTemporaryImage from "../assets/AppLockedTemporaryImage";
import { BLOCKED_TIME } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useCheckCustomerStatus } from "../hooks/query-hooks";
import { SignInStackParams } from "../SignInStack";
import { StatusTypes, UserType } from "../types";

export default function UserBlockedScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { params } = useRoute<RouteProp<SignInStackParams, "SignIn.UserBlocked">>();

  const { mutateAsync } = useCheckCustomerStatus();
  const { setSignInCorrelationId } = useSignInContext();
  const [isItPermanentBlock, setIsItPermanentBlock] = useState(false);
  const [remainingSecs, setRemainingSecs] = useState<number>(0);
  const [userExist, setUserExist] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const getUser = async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        const tempUserData = await getItemFromEncryptedStorage("tempUser");
        setUser(tempUserData ? JSON.parse(tempUserData) : null);
      }
      setUserExist(!!userData);
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
      if (user) {
        const response = await mutateAsync(user.CustomerId);
        if (response) {
          const { StatusId } = response;
          if (StatusId === StatusTypes.ACTIVE) {
            handleNavigate();
          } else {
            if (StatusId === StatusTypes.TEMPORARILY_BLOCKED) {
              const userBlockTime = new Date().getTime() + BLOCKED_TIME * 60 * 1000; //TODO: replace with the value from API
              handleTimeLogic(userBlockTime);
            }
            setIsItPermanentBlock(StatusId === StatusTypes.PERMANENTLY_BLOCKED);
          }
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
    if (await hasItemInStorage("UserBlockedFromProfileDetails")) {
      await removeItemFromEncryptedStorage("UserBlockedFromProfileDetails");
    }
    if (await hasItemInStorage("user")) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "SignIn.Passcode",
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Onboarding.OnboardingStack",
            params: {
              screen: "Onboarding.SplashScreen",
            },
          },
          {
            name: "SignIn.SignInStack",
            params: {
              screen: "SignIn.Iqama",
            },
          },
        ],
      });
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingHorizontal: theme.spacing["24p"],
  }));

  const headerPendingDeclineStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginTop: height / 5 - theme.spacing["20p"], // remove ContentContainer Padding
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer>
        <View style={containerStyle}>
          <View style={headerPendingDeclineStyle}>
            {isItPermanentBlock ? <AppLockedPermanentImage /> : <AppLockedTemporaryImage />}
            <Stack direction="vertical" gap="24p" align="center">
              <Typography.Text size="title1" weight="bold" color="neutralBase+30" align="center">
                {isItPermanentBlock
                  ? t("SignIn.UserPermanentBlockScreen.heading")
                  : t("SignIn.UserNotExistBlockedScreen.heading")}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="callout" align="center">
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
                <Typography.Text size="callout" align="center" color="neutralBase+10">
                  {t("SignIn.UserExistBlockedScreen.suggestion")}
                </Typography.Text>
              ) : null}
            </Stack>
          </View>
        </View>
      </ContentContainer>
    </Page>
  );
}
