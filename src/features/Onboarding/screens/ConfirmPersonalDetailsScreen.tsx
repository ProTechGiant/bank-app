import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { ErrorCircleIcon } from "@/assets/icons";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import RightArrow from "@/features/ViewTransactions/assets/icons/RightArrow";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { getCountryName } from "@/utils";

import LocationSVG from "../assets/location.svg";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useConfirmPersonalDetails, useNafathDetails } from "../hooks/query-hooks";
import { NafathAddress, NafathDetails } from "../types";

interface ConfirmDetailsForm {
  Email: string;
}

const schema = yup.object({
  Email: yup.string().optional().email("Please check your email address"),
});

export default function ConfirmPersonalDetailsScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { data, mutateAsync, isLoading, isError } = useNafathDetails();
  const { addressData } = useOnboardingContext(); // Using address in order to share this info between add address screen
  const { t, i18n } = useTranslation();
  const confirmPersonalDetailsAsync = useConfirmPersonalDetails();
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    if (undefined !== data) return;
    mutateAsync();
  }, [data, mutateAsync]);

  useEffect(() => {
    if (isError && !data) {
      navigation.navigate("Onboarding.Iqama", { nafathDetailFetchError: true });
    }
  }, [isError, navigation, data]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!buttonClicked) {
        navigation.navigate("Onboarding.Iqama");
      }
    }, 900000); // 15minute in milliseconds

    return () => clearTimeout(timer);
  }, [buttonClicked, navigation]);

  const { control, handleSubmit, setValue } = useForm<ConfirmDetailsForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      Email: "",
    },
  });
  const emailValue = useWatch({ control, name: "Email" });

  const customerName = i18n.language.toUpperCase() === "EN" ? data?.EnglishFirstName : data?.ArabicFirstName;

  const handleOnSubmit = async () => {
    if (undefined === addressData) return;
    try {
      setButtonClicked(true);
      await confirmPersonalDetailsAsync.mutateAsync({
        Addresses: [addressData],
        Email: emailValue,
      });
      navigation.navigate("Onboarding.OccupationInfoScreen", { userName: customerName! });
    } catch (error) {
      setShowErrorModal(true);
      warn("onboarding", "Could not confirm personal details: ", JSON.stringify(error));
    }
  };

  const isAddressCompleted =
    addressData?.StreetName &&
    addressData?.City &&
    addressData?.District &&
    addressData?.BuildingNumber &&
    addressData?.PostCode;

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["12p"],
    marginTop: theme.spacing["12p"],
  }));

  const locationContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginTop: theme.spacing["24p"],
  }));

  const emailSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginTop: theme.spacing["24p"],
    alignItems: "stretch",
  }));

  const errorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    width: "90%",
    paddingVertical: theme.spacing["24p"],
    alignSelf: "center",
    paddingRight: theme.spacing["32p"],
    paddingLeft: theme.spacing["12p"],
    backgroundColor: theme.palette["errorBase-30"],
    borderRadius: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={<ProgressIndicator currentStep={1} totalStep={4} />} pageNumber="1/4" withBackButton={false} />
      <ScrollView contentContainerStyle={mainContainerStyle}>
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="title3" weight="regular">
            {t("Onboarding.ConfirmPersonalDetailsScreen.welcome", {
              name: customerName,
            })}
          </Typography.Text>
          <Typography.Text size="title1" weight="medium">
            {t("Onboarding.ConfirmPersonalDetailsScreen.title")}
          </Typography.Text>
        </Stack>
        {isLoading ? (
          <ActivityIndicator color="secondary_blueBase-50" size="large" />
        ) : undefined !== data ? (
          <>
            <Pressable
              onPress={() =>
                navigation.navigate("Onboarding.AddAddress", {
                  isCityEditable: data.Addresses
                    ? data.Addresses[0]?.City?.trim().length ?? -1 > 0
                      ? false
                      : true
                    : true,
                })
              }>
              <Stack direction="horizontal" justify="space-between" style={locationContainerStyle} align="center">
                <Stack direction="horizontal" gap="12p" flex={1} align="center">
                  <View>
                    <LocationSVG />
                  </View>
                  <Stack direction="vertical" justify="center" flex={1}>
                    <Typography.Text size="footnote" weight="regular" color="neutralBase">
                      KSA Address
                    </Typography.Text>
                    <Typography.Text size="callout" weight="regular" color="neutralBase+30" numberOfLines={2}>
                      {addressData
                        ? formatNafathAddress(addressData, data?.NationalityCode ?? "")
                        : formatAddress(data)}
                    </Typography.Text>
                  </Stack>
                </Stack>
                <RightArrow />
              </Stack>
            </Pressable>

            {!isAddressCompleted ? (
              <Stack direction="horizontal" gap="12p" style={errorContainerStyle}>
                <Typography.Text size="callout" weight="medium" color="primaryBase-40">
                  <ErrorCircleIcon />
                </Typography.Text>
                <Stack direction="vertical" flex={1}>
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                    {t("Onboarding.ConfirmPersonalDetailsScreen.addressDetailIncomplete")}
                  </Typography.Text>
                </Stack>
              </Stack>
            ) : null}

            <Stack direction="vertical" gap="8p" style={emailSectionStyle}>
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {t("Onboarding.ConfirmPersonalDetailsScreen.email")}
              </Typography.Text>
              <TextInput
                control={control}
                name="Email"
                autoCapitalize="none"
                autoCorrect={false}
                onClear={() => setValue("Email", "")}
                label={t("Onboarding.ConfirmPersonalDetailsScreen.enterYourEmail")}
                keyboardType="email-address"
                testID="Onboarding.ConfirmPersonalDetailsScreen:EmailInput"
              />
            </Stack>
          </>
        ) : null}
      </ScrollView>
      <Stack align="stretch" direction="vertical" style={footerStyle}>
        <SubmitButton
          isDisabled={!(emailValue && emailValue.trim().length > 0) || !isAddressCompleted}
          control={control}
          onSubmit={handleSubmit(handleOnSubmit)}
          testID="Onboarding.ConfirmDetails:ContinueButton">
          {t("Onboarding.ConfirmPersonalDetailsScreen.Continue")}
        </SubmitButton>
      </Stack>
      <NotificationModal
        testID="Onboarding.ConfirmPersonalDetailsScreen.errorModal:NotificationModal"
        variant="error"
        title={t("Onboarding.ConfirmPersonalDetailsScreen.errorModal.somethingWrong")}
        message={t("Onboarding.ConfirmPersonalDetailsScreen.errorModal.tryAgainLater")}
        isVisible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </Page>
  );
}

function concatStr(glue: string, inputs: Array<string | undefined>) {
  const retVal = inputs
    .filter(v => undefined !== v && v.length > 0)
    .join(glue)
    .trim();

  return retVal.length > 0 ? retVal : undefined;
}

function formatAddress(data: NafathDetails) {
  if (!data.Addresses?.length) {
    return;
  }
  const street: string = addSuffix(data.Addresses?.[0]?.StreetName, ", ");
  const city: string = addSuffix(data.Addresses?.[0]?.City, " ");
  const postCode: string = addSuffix(data.Addresses?.[0]?.PostCode, " ");
  const country = addSuffix(getCountryName(data.NationalityCode), "");
  return concatStr("", [street + city + postCode + country]);
}

function formatNafathAddress(data: NafathAddress, countryString: string) {
  const street: string = addSuffix(data.StreetName, ", ");
  const city: string = addSuffix(data.City, " ");
  const postCode: string = addSuffix(data.PostCode, " ");
  const country = addSuffix(getCountryName(countryString), "");
  return concatStr("", [street + city + postCode + country]);
}

function addSuffix(value: string | undefined | null, suffix: string): string {
  return value ? value + suffix : "";
}
