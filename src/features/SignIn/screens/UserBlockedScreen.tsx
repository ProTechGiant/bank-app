import { RouteProp, useRoute } from "@react-navigation/native";
import { addMinutes, differenceInMilliseconds } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Pressable, useWindowDimensions, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
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
import { convertKsaToUtcTime } from "../utils/convertKsaToUtcTime";

export default function UserBlockedScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const { params } = useRoute<RouteProp<SignInStackParams, "SignIn.UserBlocked">>();
  const textSize = width > 390 ? "callout" : "footnote";
  const { mutateAsync } = useCheckCustomerStatus();
  const { setSignInCorrelationId } = useSignInContext();
  const [isItPermanentBlock, setIsItPermanentBlock] = useState(false);
  const [isStatusChecked, setIsStatusChecked] = useState(false);
  const [remainingSecs, setRemainingSecs] = useState<number>(0);
  const [user, setUser] = useState<UserType | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const _correlationId = generateRandomId();
    setSignInCorrelationId(_correlationId);
    (async () => {
      // Fetching user here
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
      // checking if user is permanent block
      const userBlocked = await getItemFromEncryptedStorage("UserBlocked");
      if (userBlocked !== null) {
        if (JSON.parse(userBlocked) === true) setIsItPermanentBlock(true);
        checkUserAccountStatus();
      }
    })();
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    const interval = setInterval(() => {
      setRemainingSecs(prevCountdown => (prevCountdown > 0 ? prevCountdown - 1 : prevCountdown));
    }, 1000);
    return () => {
      clearTimeout(timeoutRef.current);
      backHandler.remove();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (remainingSecs <= 0 && isStatusChecked) {
      handleNavigate();
    }
  }, [remainingSecs]);

  const checkUserAccountStatus = async () => {
    try {
      if (user) {
        const response = await mutateAsync(user.CustomerId);
        if (response) {
          const utcTime = convertKsaToUtcTime(response.LastModifiedTime);

          if (response.StatusId === StatusTypes.ACTIVE) {
            handleNavigate();
          } else {
            if (response.StatusId === StatusTypes.BLACK_LISTED) {
              // TODO: Will update this check with Temporary Lock instead of BLACK_LISTED
              const userUnBlockTime = addMinutes(utcTime, BLOCKED_TIME);
              handleTimeLogic(userUnBlockTime);
            }
            setIsItPermanentBlock(response.StatusId === StatusTypes.BLOCKED);
          }
        }
      }
    } catch (err) {
      warn("checkUserStatus", "Could check user status. Error: ", JSON.stringify(err));
    }
  };

  const handleTimeLogic = (userUnBlockTime: Date) => {
    const remainingTime = differenceInMilliseconds(userUnBlockTime, new Date());

    if (remainingTime <= 0) {
      handleNavigate();
    } else {
      timeoutRef.current = setTimeout(handleNavigate, remainingTime);
    }
    setRemainingSecs(Math.floor(remainingTime / 1000));
    setIsStatusChecked(true);
  };

  const handleNavigate = async (isBackButtonPressed = false) => {
    await removeItemFromEncryptedStorage("UserBlocked");
    if (await hasItemInStorage("UserBlockedFromProfileDetails")) {
      await removeItemFromEncryptedStorage("UserBlockedFromProfileDetails");
    }
    if ((await hasItemInStorage("user")) && !isBackButtonPressed) {
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
    marginTop: height / 5 - theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  const resetContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: theme.spacing["32p"],
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  }));

  const resetInnerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.complimentBase,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={isItPermanentBlock ? true : false} onBackPress={() => handleNavigate(true)} />
      <ContentContainer>
        <View style={containerStyle}>
          <View style={headerPendingDeclineStyle}>
            {isItPermanentBlock ? <AppLockedPermanentImage /> : <AppLockedTemporaryImage />}
            <Stack direction="vertical" gap="24p" align="center">
              <Typography.Text
                testID="SignIn.UserPermanentBlockScreen:Heading"
                size="title1"
                weight="bold"
                color="neutralBase+30"
                align="center">
                {isItPermanentBlock
                  ? t("SignIn.UserPermanentBlockScreen.heading")
                  : t("SignIn.UserNotExistBlockedScreen.heading")}
              </Typography.Text>
              <Typography.Text
                testID="SignIn.UserPermanentBlockScreen:Message"
                color="neutralBase+10"
                size="callout"
                align="center">
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
                <Typography.Text
                  testID="SignIn.UserPermanentBlockScreen:Suggestion"
                  size={textSize}
                  align="center"
                  color="neutralBase+10">
                  {t("SignIn.UserExistBlockedScreen.suggestion")}
                </Typography.Text>
              ) : null}
            </Stack>
          </View>
        </View>
      </ContentContainer>
      {isItPermanentBlock ? (
        <Pressable style={resetContainerStyle} onPress={() => navigation.navigate("SignIn.ForgotPassword")}>
          <View style={resetInnerContainerStyle}>
            <Typography.Text
              testID="SignIn.UserPermanentBlockScreen:ResetPasscode"
              color="complimentBase"
              size="footnote"
              align="center"
              weight="medium">
              {t("SignIn.UserPermanentBlockScreen.resetPasscode")}
            </Typography.Text>
          </View>
        </Pressable>
      ) : null}
    </Page>
  );
}
